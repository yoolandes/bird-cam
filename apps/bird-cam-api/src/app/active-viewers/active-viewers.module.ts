import { Module } from '@nestjs/common';
import { JanusEventsModule } from '../janus-events/janus-events.module';
import { ActiveViewersService } from './application/active-viewers.service';
import { ActiveViewserWsService } from './infrastructure/active-viewers-ws.service';

@Module({
  imports: [JanusEventsModule],
  providers: [ActiveViewersService, ActiveViewserWsService],
})
export class ActiveViewersModule {}
