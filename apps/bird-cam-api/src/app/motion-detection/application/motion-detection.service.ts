import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import { JanusEventsService } from '../../janus-events/application/janus-events.service';
import { Uv4lApiService } from '../../janus-events/infrastructure/uv4l-api.service';
import { MotionDetectionEventsService } from '../motion-detection-events.service';
import { catchError, filter, of, switchMap, tap, zip } from 'rxjs';
import { RecorderService } from '../../recorder/application/recorder.service';

@Injectable()
export class MotionDetectionService {
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
        switchMap(() => this.janusEventsService.publisherHasPublished),
        switchMap(() => {
          return this.recorderService.startRecording().pipe(
            catchError((err) => {
              this.loggerService.info('Cant start recording');
              this.loggerService.error(err.message);
              return of();
            })
          );
        }),
        switchMap((recorderUuid) =>
          zip(of(recorderUuid), this.motionDetectionService.motionDetected$)
        ),
        filter(([_, motionDetected]) => !motionDetected),
        switchMap(([recorderUuid, _]) => {
          return this.recorderService.stopRecording(recorderUuid).pipe(
            catchError((err) => {
              this.loggerService.info('Cant stop recording');
              this.loggerService.error(err.message);
              return of();
            })
          );
        }),
        switchMap(() => this.uv4lApiService.stopBirdCamWhenNoSubscriber())
      )
      .subscribe(() => {});
  }
}
