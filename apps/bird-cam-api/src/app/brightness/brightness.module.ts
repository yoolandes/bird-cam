import { Module } from '@nestjs/common';
import { JanusEventsModule } from '../janus-events/janus-events.module';
import { BrightnessEventsService } from './brightness-events.service';
import { BrightnessController } from './brightness.controller';
import { BrightnessEventHandlerService } from './application/brightness-event-handler.service';
import { LedApiService } from './infrastructure/led-api.service';
import { HttpModule } from '@nestjs/axios';
import { LoggerModule } from '@bird-cam/logger';
import { SnapshotModule } from '../snapshot/snapshot.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [BrightnessController],
  providers: [
    BrightnessEventsService,
    BrightnessEventHandlerService,
    LedApiService,
  ],
  imports: [
    JanusEventsModule,
    HttpModule,
    LoggerModule,
    SnapshotModule,
    ConfigModule,
  ],
})
export class BrightnessModule {}
