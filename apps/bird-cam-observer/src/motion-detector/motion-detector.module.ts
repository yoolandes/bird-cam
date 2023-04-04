import { Module } from '@nestjs/common';
import { LoggerModule } from '@bird-cam/logger';
import { SnapshotModule } from '../snapshot/snapshot.module';

import { MotionDetectorService } from './motion-detector.service';

@Module({
  imports: [SnapshotModule, LoggerModule],
  providers: [MotionDetectorService],
  exports: [MotionDetectorService],
})
export class MotionDetectorModule { }
