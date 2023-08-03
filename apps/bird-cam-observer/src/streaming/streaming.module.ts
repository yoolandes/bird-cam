import { Module } from '@nestjs/common';

import { StreamingService } from './streaming.service';
import { StreamingController } from './streaming.controller';
import { LoggerModule } from '@bird-cam/logger';

@Module({
  imports: [LoggerModule],
  controllers: [StreamingController],
  providers: [StreamingService],
})
export class StreamingModule {}
