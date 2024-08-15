import { Module } from '@nestjs/common';
import { JanusEventsModule } from '../janus-events/janus-events.module';
import { ActiveViewersService } from './application/active-viewers.service';
import { ActiveViewserWsService } from './infrastructure/active-viewers-ws.service';
import { LoggerModule } from '@bird-cam/logger';
import { ActiveViewersController } from './active-viewers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewActivityEntity } from './view-activity.entity';
import { ViewActivityService } from './view-activity.service';
import { ViewActivityController } from './view-activity.controller';
import { ActiveViewersEventHandlerService } from './application/active-viewers-event-handler.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ViewActivityEntity]),
    JanusEventsModule,
    LoggerModule,
  ],
  controllers: [ActiveViewersController, ViewActivityController],
  providers: [
    ActiveViewersService,
    ActiveViewserWsService,
    ViewActivityService,
    ActiveViewersEventHandlerService,
  ],
})
export class ActiveViewersModule {}
