import { Injectable } from '@nestjs/common';
import { PushSubscriptionService } from '../../push-subscription/push-subscription.service';
import { LoggerService } from '@bird-cam/logger';
import { MotionDetectionEventsService } from '../motion-detection-events.service';
import { catchError, EMPTY, exhaustMap, throttleTime } from 'rxjs';

@Injectable()
export class PushMotionNotificationService {
  constructor(
    private readonly motionDetectionService: MotionDetectionEventsService,
    private readonly pushSubscriptionService: PushSubscriptionService,
    private readonly loggerService: LoggerService
  ) {
    this.motionDetectionService.motionDetected$
      .pipe(
        throttleTime(1000 * 60 * 5),
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
