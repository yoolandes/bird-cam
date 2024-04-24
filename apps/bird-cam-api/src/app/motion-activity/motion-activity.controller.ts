import { Controller, Get, Query } from '@nestjs/common';

import { MotionActivityService } from './motion-activity.service';

@Controller('motion-activity')
export class MotionActivityController {
  constructor(private readonly motionActivityService: MotionActivityService) {}

  @Get()
  async findAll(
    @Query('hours') hours: number
  ): Promise<{ [key: number]: number }> {
    return this.motionActivityService.findAllFromLastHours(hours);
  }
}
