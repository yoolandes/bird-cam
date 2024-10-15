import {
  Controller,
  Get,
  Header,
  Headers,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import fs from 'fs';
import { TimelapseService } from './timelapse.service';

@Controller('timelapse')
export class TimelapseController {
  constructor(private readonly timelapseService: TimelapseService) {}

  @Get()
  @Header('Accept-Ranges', 'bytes')
  @Header('Content-Type', 'video/mp4')
  async getFile(@Headers('range') range, @Res() res: Response) {
    const videoPath = this.timelapseService.getTimelapse();
    const { size } = fs.statSync(videoPath);

    let [start, end] = range.replace(/bytes=/, '').split('-');
    start = parseInt(start, 10);
    end = end ? parseInt(end, 10) : size - 1;

    const readStreamfile = fs.createReadStream(videoPath, {
      start,
      end,
      highWaterMark: 60,
    });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': end - start + 1,
    };
    res.writeHead(HttpStatus.PARTIAL_CONTENT, head);
    readStreamfile.pipe(res);
  }
}
