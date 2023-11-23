import { Module } from '@nestjs/common';
import { MotionDetectionController } from './motion-detection.controller';
import { MotionDetectionEventsService } from './motion-detection-events.service';
import { MotionDetectionService } from './application/motion-detection.service';
import { JanusEventsModule } from '../janus-events/janus-events.module';
import { LoggerModule } from '@bird-cam/logger';
import { SnapshotModule } from '../snapshot/snapshot.module';

@Module({
  controllers: [MotionDetectionController],
  providers: [MotionDetectionEventsService, MotionDetectionService],
  exports: [MotionDetectionEventsService],
  imports: [JanusEventsModule, LoggerModule, SnapshotModule],
})
export class MotionDetectionModule {}
