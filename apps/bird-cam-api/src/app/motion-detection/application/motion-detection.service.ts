import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import { catchError, filter, of, switchMap, tap } from 'rxjs';
import { StreamingService } from '../../janus-events/application/streaming.service';
import { RecorderService } from '../../recorder/application/recorder.service';
import { MotionDetectionEventsService } from '../motion-detection-events.service';

@Injectable()
export class MotionDetectionService {
  private recorderUuid: string | undefined;

  constructor(
    private readonly motionDetectionService: MotionDetectionEventsService,
    private readonly streamingService: StreamingService,
    private readonly recorderService: RecorderService,
    private readonly loggerService: LoggerService
  ) {
    this.motionDetectionService.motionDetected$
      .pipe(
        tap((motionDetected) =>
          this.loggerService.info('Motion detected ' + motionDetected)
        ),
        filter((motionDetected) => motionDetected),
        switchMap(() => this.streamingService.startBirdCam()),
        tap(() => this.loggerService.log('starting recording')),
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
        tap(() => this.loggerService.log('stopping recording')),
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
        switchMap(() => this.streamingService.stopBirdCamWhenNoSubscriber())
      )
      .subscribe();
  }
}
