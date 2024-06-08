import { Module } from '@nestjs/common';
import { HealthPingController } from './health-ping.controller';

@Module({
  controllers: [HealthPingController],
})
export class HealthPingModule {}
