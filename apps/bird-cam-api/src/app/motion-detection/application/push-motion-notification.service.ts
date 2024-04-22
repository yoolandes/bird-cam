import { Injectable } from '@nestjs/common';
import { catchError, EMPTY, exhaustMap, filter } from 'rxjs';
import { MotionDetectionEventsService } from '../motion-detection-events.service';
import { PushSubscriptionService } from '../../push-subscription/push-subscription.service';
import { LoggerService } from '@bird-cam/logger';

@Injectable()
export class PushMotionNotificationService {
  constructor(
    private readonly motionDetectionEventsService: MotionDetectionEventsService,
    private readonly pushSubscriptionService: PushSubscriptionService,
    private readonly loggerService: LoggerService
  ) {
    this.motionDetectionEventsService.motionDetected$
      .pipe(
        filter(({ motionDetected }) => motionDetected),
        exhaustMap(() => {
          return this.pushSubscriptionService
            .sendNotification('Es tut sich was im Vogelhaus', 'Bewegung')
            .pipe(
              catchError((err) => {
                this.loggerService.log(err);
                this.loggerService.info('Cant send Push Notification');
                this.loggerService.error(err.message);
                return EMPTY;
              })
            );
        })
      )
      .subscribe({
        complete: () =>
          this.loggerService.error('Completed! This can not be! Notification'),
        error: (err) => this.loggerService.error(err),
      });
  }
}
