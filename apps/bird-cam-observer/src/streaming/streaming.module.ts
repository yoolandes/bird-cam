import { Module } from '@nestjs/common';

import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';
import { LoggerModule } from '@bird-cam/logger';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [LoggerModule, HttpModule],
  controllers: [StreamingController],
  providers: [StreamingService],
  exports: [StreamingService],
})
export class StreamingModule {}
