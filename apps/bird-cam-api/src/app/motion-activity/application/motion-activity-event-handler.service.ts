import { Injectable } from '@nestjs/common';
import { MotionDetectionEventsService } from '../../motion-detection/motion-detection-events.service';
import { MotionActivityService } from '../motion-activity.service';

@Injectable()
export class MotionActivityEventHandlerService {
  constructor(
    private readonly motionDetectionEventsService: MotionDetectionEventsService,
    private readonly motionActivityService: MotionActivityService
  ) {
    this.motionDetectionEventsService.motionDetected$.pipe().subscribe(() => {
      this.motionActivityService.create();
    });
  }
}
