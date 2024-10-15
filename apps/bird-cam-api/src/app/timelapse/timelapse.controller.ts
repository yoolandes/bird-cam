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

    // Gesamtgröße in Bytes
    const { size } = fs.statSync(videoPath);
    console.log('size');
    console.log(size);
    const chunksize = 10 ** 6;
    console.log('size');
    console.log(size);
    // Größe
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    console.log('start');
    console.log(start);

    const end = Math.min(size, start + chunksize) - 1;
    console.log('end');
    console.log(end);

    const readStreamfile = fs.createReadStream(videoPath, {
      start,
      end,
      highWaterMark: 60,
    });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Content-Length': chunksize,
    };
    res.writeHead(HttpStatus.PARTIAL_CONTENT, head);
    readStreamfile.pipe(res);
  }
}
