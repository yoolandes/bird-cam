import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import { JanusEventsService } from '../../janus-events/application/janus-events.service';
import { Uv4lApiService } from '../../janus-events/infrastructure/uv4l-api.service';
import { MotionDetectionEventsService } from '../motion-detection-events.service';
import { catchError, filter, of, switchMap, tap, zip } from 'rxjs';
import { RecorderService } from '../../recorder/application/recorder.service';

@Injectable()
export class MotionDetectionService {
  private recorderUuid: string | undefined;

  constructor(
    private readonly motionDetectionService: MotionDetectionEventsService,
    private readonly uv4lApiService: Uv4lApiService,
    private readonly recorderService: RecorderService,
    private readonly loggerService: LoggerService,
    private readonly janusEventsService: JanusEventsService
  ) {
    this.motionDetectionService.motionDetected$
      .pipe(
        tap((motionDetected) =>
          this.loggerService.info('Motion detected ' + motionDetected)
        ),
        filter((motionDetected) => motionDetected),
        switchMap(() => this.uv4lApiService.startBirdCam()),
        switchMap((isStreaming) =>
          isStreaming
            ? of(void 0)
            : this.janusEventsService.publisherHasPublished
        ),
        switchMap(() => {
          return this.recorderService.startRecording().pipe(
            catchError((err) => {
              this.loggerService.info('Cant start recording');
              this.loggerService.error(err.message);
              return of();
            })
          );
        }),
        tap((recorderUuid) => (this.recorderUuid = recorderUuid))
      )
      .subscribe(() => this.loggerService.info('Started Recording Motion'));

    this.motionDetectionService.motionDetected$
      .pipe(
        filter((motionDetected) => !motionDetected),
        switchMap(() => {
          return this.recorderService.stopRecording(this.recorderUuid).pipe(
            catchError((err) => {
              this.loggerService.info('Cant stop recording');
              this.loggerService.error(err.message);
              return of();
            })
          );
        }),
        tap(() => (this.recorderUuid = undefined)),
        tap(() => this.loggerService.info('Stopped Recording Motion')),
        switchMap(() => this.uv4lApiService.stopBirdCamWhenNoSubscriber())
      )
      .subscribe();
  }
}
