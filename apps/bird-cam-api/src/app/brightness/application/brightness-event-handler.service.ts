import { Injectable } from '@nestjs/common';
import { catchError, filter, switchMap, take, tap } from 'rxjs';
import { LedApiService } from '../infrastructure/led-api.service';
import { LoggerService } from '@bird-cam/logger';
import { StreamingService } from '../../janus-events/application/streaming.service';
import { ConfigService } from '@nestjs/config';
import { retryBackoff } from 'backoff-rxjs';
import { getAverageColor } from 'fast-average-color-node';
import { SnapshotService } from '../../snapshot/application/snapshot.service';

@Injectable()
export class BrightnessEventHandlerService {
  birdcamRTSP: string;
  birdcamRTSPUsername: string;
  birdcamRTSPPassword: string;

  constructor(
    private readonly streamingService: StreamingService,
    private readonly ledApiService: LedApiService,
    private readonly loggerService: LoggerService,
    private readonly snapshotService: SnapshotService,
    private readonly configService: ConfigService
  ) {
    this.birdcamRTSP = this.configService.getOrThrow<string>('BIRDCAM_RTSP');
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
        switchMap((base64) => getAverageColor(Buffer.from(base64, 'base64'))),
        tap(({ value }) => this.loggerService.log(value.toString())),
        filter(({ isDark }) => isDark),
        switchMap(() => this.ledApiService.switchOn()),
        tap(() => this.loggerService.info('Switched LED on')),
        catchError((err) => {
          this.loggerService.error(err);
          this.loggerService.error('Can not switch on LED! Trying again...');
          throw err;
        }),
        retryBackoff({
          initialInterval: 1000,
          maxRetries: 3,
        })
      )
      .subscribe({
        complete: () =>
          this.loggerService.error('Completed! This can not be! Brightness on'),
        error: (err) => this.loggerService.error(err),
      });

    this.streamingService.birdcamIsStreaming$
      .pipe(
        filter((birdcamIsStreaming) => !birdcamIsStreaming),
        switchMap(() => this.ledApiService.switchOff()),
        tap(() => this.loggerService.info('Switched LED off')),
        catchError((err) => {
          this.loggerService.error(err);
          this.loggerService.error('Can not switch off LED! Try again...');
          throw err;
        }),
        retryBackoff({
          initialInterval: 1000,
          maxRetries: 3,
        })
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
