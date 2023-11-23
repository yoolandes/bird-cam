import { BadRequestException, Body, Controller, Put } from '@nestjs/common';
import { StreamingService } from './streaming.service';

@Controller('streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Put()
  async setStreaming(@Body() res: { on: boolean }) {
    if (res.on) {
      await this.streamingService
        .startStream()
        .then(() => {
          return void 0;
        })
        .catch((err) => {
          throw new BadRequestException(err);
        });
    } else {
      await this.streamingService
        .stopStream()
        .then(() => {
          return void 0;
        })
        .catch((err) => {
          throw new BadRequestException(err);
        });
    }
  }
}
