import { Controller, Get, Query } from '@nestjs/common';
import { ViewActivityService } from './view-activity.service';

@Controller('view-activity')
export class ViewActivityController {
  constructor(private readonly viewActivityService: ViewActivityService) {}

  @Get()
  async findAll(
    @Query('hours') hours: number
  ): Promise<{ [key: number]: number }> {
    return this.viewActivityService.findAllFromLastHours(hours);
  }
}
