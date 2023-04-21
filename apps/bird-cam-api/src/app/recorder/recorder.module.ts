import { LoggerModule } from '@bird-cam/logger';
import { Module } from '@nestjs/common';
import { JanusEventsModule } from '../janus-events/janus-events.module';
import { RecorderService } from './application/recorder.service';

@Module({
  imports: [LoggerModule, JanusEventsModule],
  providers: [RecorderService],
  exports: [RecorderService],
})
export class RecorderModule {}
