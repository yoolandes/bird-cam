import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MotionActivityEntity } from './motion-activity.entity';
import { MotionActivityController } from './motion-activity.controller';

import { MotionActivityService } from './motion-activity.service';
import { MotionActivityEventHandlerService } from './application/motion-activity-event-handler.service';
import { MotionDetectionModule } from '../motion-detection/motion-detection.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MotionActivityEntity]),
    MotionDetectionModule,
  ],
  controllers: [MotionActivityController],
  providers: [MotionActivityService, MotionActivityEventHandlerService],
})
export class MotionActivityModule {}
