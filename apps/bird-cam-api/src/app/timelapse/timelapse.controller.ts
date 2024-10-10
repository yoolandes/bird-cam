import { Controller, Get, Res, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { TimelapseService } from './timelapse.service';

@Controller('timelapse')
export class TimelapseController {
  constructor(private readonly timelapseService: TimelapseService) {}
  @Get()
  getFile() {
    return new StreamableFile(this.timelapseService.getTimelapse());
  }
}
