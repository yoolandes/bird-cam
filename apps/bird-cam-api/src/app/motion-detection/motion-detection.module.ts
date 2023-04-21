import { Module } from '@nestjs/common';
import { MotionDetectionController } from './motion-detection.controller';
import { MotionDetectionEventsService } from './motion-detection-events.service';
import { MotionDetectionService } from './application/motion-detection.service';
import { RecorderModule } from '../recorder/recorder.module';
import { JanusEventsModule } from '../janus-events/janus-events.module';
import { LoggerModule } from '@bird-cam/logger';

@Module({
  controllers: [MotionDetectionController],
  providers: [MotionDetectionEventsService, MotionDetectionService],
  exports: [MotionDetectionEventsService],
  imports: [RecorderModule, JanusEventsModule, LoggerModule],
})
export class MotionDetectionModule {}
