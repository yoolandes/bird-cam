import { Module } from '@nestjs/common';
import { SnapshotModule } from '../snapshot/snapshot.module';

import { MotionDetectorService } from './motion-detector.service';

@Module({
  imports: [SnapshotModule],
  providers: [MotionDetectorService],
  exports: [MotionDetectorService],
})
export class MotionDetectorModule { }
