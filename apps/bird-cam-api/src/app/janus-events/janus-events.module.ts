import { Module } from '@nestjs/common';
import { JanusEventsController } from './janus-events.controller';
import { JanusEventsService } from './janus-events.service';
import { HttpModule } from '@nestjs/axios';
import { JanusApiService } from './janus-api.service';
import { JanusEventHandlerService } from './janus-event-handler.service';

@Module({
  imports: [HttpModule],
  controllers: [JanusEventsController],
  providers: [JanusEventsService, JanusApiService, JanusEventHandlerService],
})
export class JanusEventsModule {}
