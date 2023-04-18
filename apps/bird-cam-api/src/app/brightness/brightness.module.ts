import { Module } from '@nestjs/common';
import { JanusEventsModule } from '../janus-events/janus-events.module';
import { BrightnessEventsService } from './brightness-events.service';
import { BrightnessController } from './brightness.controller';
import { BrightnessEventHandlerService } from './application/brightness-event-handler.service';
import { LedApiService } from './infrastructure/led-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [BrightnessController],
  providers: [
    BrightnessEventsService,
    BrightnessEventHandlerService,
    LedApiService,
  ],
  imports: [JanusEventsModule, HttpModule],
})
export class BrightnessModule {}
