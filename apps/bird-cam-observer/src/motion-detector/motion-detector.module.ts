import { Module } from '@nestjs/common';
import { LoggerModule } from '@bird-cam/logger';

import { MotionDetectorService } from './motion-detector.service';
import {StreamingModule} from "../streaming/streaming.module";

@Module({
  imports: [LoggerModule, StreamingModule],
  providers: [MotionDetectorService],
  exports: [MotionDetectorService],
})
export class MotionDetectorModule { }
