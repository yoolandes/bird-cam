import { Body, Controller, Post } from '@nestjs/common';
import { JanusMessage } from './model/janus-message.model';

import { JanusEventsApiService } from './infrastructure/janus-events-api.service';

@Controller('events')
export class JanusEventsController {
  constructor(private readonly janusEventsService: JanusEventsApiService) {}

  @Post()
  create(@Body() messages: JanusMessage[]) {
    messages.forEach(message => this.janusEventsService.publishMessage(message));
   }
}
