import { Module } from '@nestjs/common';
import { JanusEventsController } from './janus-events.controller';
import { JanusEventsApiService } from './infrastructure/janus-events-api.service';
import { HttpModule } from '@nestjs/axios';
import { JanusAdminApiService } from './infrastructure/janus-admin-api.service';
import { JanusEventHandlerService } from './application/janus-event-handler.service';
import { LoggerModule } from '@bird-cam/logger';
import { JanusEventsService } from './application/janus-events.service';
import { StreamingApiService } from './infrastructure/streaming-api.service';
import { StreamingService } from './application/streaming.service';
import { JanodeService } from './application/janode-api.service';
import { JanusStreamingApiService } from './infrastructure/janus-streaming-api.service';

@Module({
  imports: [HttpModule, LoggerModule],
  exports: [
    StreamingApiService,
    JanusEventsApiService,
    JanusEventsService,
    JanusAdminApiService,
    JanusStreamingApiService,
    StreamingService,
    JanodeService,
  ],
  controllers: [JanusEventsController],
  providers: [
    JanusEventsApiService,
    JanusAdminApiService,
    JanusEventHandlerService,
    JanusEventsService,
    JanusStreamingApiService,
    StreamingApiService,
    StreamingService,
    JanodeService,
  ],
})
export class JanusEventsModule {}
