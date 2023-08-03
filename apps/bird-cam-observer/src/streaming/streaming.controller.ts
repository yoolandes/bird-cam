import { Body, Controller, Put } from '@nestjs/common';
import { StreamingService } from './streaming.service';

@Controller('streaming')
export class StreamingController {
  constructor(private readonly streamingService: StreamingService) {}

  @Put()
  async setStreaming(@Body() res: { on: boolean }) {
    if (res.on) {
      this.streamingService.startStream();
      return {
        on: true,
      };
    } else {
      this.streamingService.stopStream();
      return {
        on: false,
      };
    }
  }
}
