import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { LedController } from './led.controller';

import { LedService } from './led.service';

@Module({
  imports: [LoggerModule],
  controllers: [LedController],
  providers: [LedService],
})
export class LedModule { }
