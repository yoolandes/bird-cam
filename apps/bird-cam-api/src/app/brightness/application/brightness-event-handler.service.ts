import { Injectable } from '@nestjs/common';
import { catchError, filter, of, switchMap, take, tap } from 'rxjs';
import { LedApiService } from '../infrastructure/led-api.service';
import { LoggerService } from '@bird-cam/logger';
import { StreamingService } from '../../janus-events/application/streaming.service';
import { ConfigService } from '@nestjs/config';
import { retryBackoff } from 'backoff-rxjs';
import { getAverageColor } from 'fast-average-color-node';
import { SnapshotService } from '../../snapshot/application/snapshot.service';

@Injectable()
export class BrightnessEventHandlerService {
  birdcamRTSPUsername: string;
  birdcamRTSPPassword: string;

  constructor(
    private readonly streamingService: StreamingService,
    private readonly ledApiService: LedApiService,
    private readonly loggerService: LoggerService,
    private readonly snapshotService: SnapshotService,
    private readonly configService: ConfigService
  ) {
    this.birdcamRTSPUsername = this.configService.getOrThrow<string>(
      'BIRDCAM_RTSP_USERNAME'
    );
    this.birdcamRTSPPassword = this.configService.getOrThrow<string>(
      'BIRDCAM_RTSP_PASSWORD'
    );

    this.streamingService.birdcamIsStreaming$
      .pipe(
        filter((birdcamIsStreaming) => birdcamIsStreaming),
        switchMap(() => this.snapshotService.snapshot$.pipe(take(1))),
        tap(() => this.loggerService.log('Checking brightness...')),
        switchMap((base64) =>
          getAverageColor(Buffer.from(base64, 'base64')).catch((err) => {
            this.loggerService.log('getAverageColor failed');
            return {
              isDark: true,
              value: '',
            };
          })
        ),
        tap(({ value }) => this.loggerService.log(value.toString())),
        filter(({ isDark }) => isDark),
        switchMap(() =>
          this.ledApiService.switchOn().pipe(
            tap(() => this.loggerService.info('Switched LED on')),
            catchError((err) => {
              this.loggerService.error(err);
              this.loggerService.error(
                'Can not switch on LED! Trying again...'
              );
              throw err;
            }),
            retryBackoff({
              initialInterval: 1000,
              maxRetries: 3,
            }),
            catchError((err) => {
              this.loggerService.error(err);
              return of(void 0);
            })
          )
        )
      )
      .subscribe({
        complete: () =>
          this.loggerService.error('Completed! This can not be! Brightness on'),
        error: (err) => this.loggerService.error(err),
      });

    this.streamingService.birdcamIsStreaming$
      .pipe(
        filter((birdcamIsStreaming) => !birdcamIsStreaming),
        switchMap(() =>
          this.ledApiService.switchOff().pipe(
            catchError((err) => {
              this.loggerService.error(err);
              this.loggerService.error('Can not switch off LED! Try again...');
              throw err;
            }),
            retryBackoff({
              initialInterval: 1000,
              maxRetries: 3,
            }),
            catchError((err) => {
              this.loggerService.error(err);
              return of(void 0);
            })
          )
        ),
        tap(() => this.loggerService.info('Switched LED off'))
      )
      .subscribe({
        complete: () =>
          this.loggerService.error(
            'Completed! This can not be! Brightness off'
          ),
        error: (err) => this.loggerService.error(err),
      });
  }
}
