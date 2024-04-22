import { Module } from '@nestjs/common';
import { JanusEventsModule } from '../janus-events/janus-events.module';
import { ActiveViewersService } from './application/active-viewers.service';
import { ActiveViewserWsService } from './infrastructure/active-viewers-ws.service';
import { LoggerModule } from '@bird-cam/logger';

@Module({
  imports: [JanusEventsModule, LoggerModule],
  providers: [ActiveViewersService, ActiveViewserWsService],
})
export class ActiveViewersModule {}
