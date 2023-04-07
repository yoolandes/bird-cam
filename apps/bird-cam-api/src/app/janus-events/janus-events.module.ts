import { Module } from '@nestjs/common';
import { JanusEventsController } from './janus-events.controller';
import { JanusEventsApiService } from './infrastructure/janus-events-api.service';
import { HttpModule } from '@nestjs/axios';
import { JanusApiService } from './infrastructure/janus-api.service';
import { JanusEventHandlerService } from './application/janus-event-handler.service';
import { LoggerModule } from '@bird-cam/logger';
import { JanusEventsService } from './application/janus-events.service';
import { Uv4lApiService } from './infrastructure/uv4l-api.service';

@Module({
  imports: [HttpModule, LoggerModule],
  controllers: [JanusEventsController],
  providers: [JanusEventsApiService, JanusApiService, JanusEventHandlerService, JanusEventsService, Uv4lApiService],
})
export class JanusEventsModule {}
