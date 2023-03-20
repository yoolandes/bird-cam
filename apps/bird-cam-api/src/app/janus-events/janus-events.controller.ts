import { Body, Controller, Post } from '@nestjs/common';
import { JanusMessage } from './dto/janus-message.dto';

import { JanusEventsService } from './janus-events.service';

@Controller('events')
export class JanusEventsController {
  constructor(private readonly janusEventsService: JanusEventsService) {}

  @Post()
  create(@Body() messages: JanusMessage[]) {
    messages.forEach(message => this.janusEventsService.publishMessage(message));
   }
}
