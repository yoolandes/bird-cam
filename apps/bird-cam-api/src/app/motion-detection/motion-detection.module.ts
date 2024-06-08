import { Module } from '@nestjs/common';
import { MotionDetectionController } from './motion-detection.controller';
import { MotionDetectionEventsService } from './motion-detection-events.service';
import { MotionDetectionService } from './application/motion-detection.service';
import { JanusEventsModule } from '../janus-events/janus-events.module';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { PushMotionNotificationService } from './application/push-motion-notification.service';
import { PushSubscriptionModule } from '../push-subscription/push-subscription.module';
import { LoggerModule } from '@bird-cam/logger';

@Module({
  controllers: [MotionDetectionController],
  providers: [
    MotionDetectionEventsService,
    MotionDetectionService,
    PushMotionNotificationService,
  ],
  exports: [MotionDetectionEventsService],
  imports: [
    JanusEventsModule,
    LoggerModule,
    SnapshotModule,
    PushSubscriptionModule,
  ],
})
export class MotionDetectionModule {}
