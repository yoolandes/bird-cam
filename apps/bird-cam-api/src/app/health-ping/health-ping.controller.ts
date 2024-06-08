import { Controller, Get } from '@nestjs/common';

@Controller('health-ping')
export class HealthPingController {
  @Get()
  healthPing() {
    return { data: 'health-pong' };
  }
}
