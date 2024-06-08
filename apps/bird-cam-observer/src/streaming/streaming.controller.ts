import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Put,
} from '@nestjs/common';
import { StreamingService } from './streaming.service';
import { catchError, Observable } from 'rxjs';
import { LoggerService } from '@bird-cam/logger';

@Controller('streaming')
export class StreamingController {
  constructor(
    private readonly streamingService: StreamingService,
    private readonly loggerService: LoggerService
  ) {}

  @Put()
  setStreaming(@Body() res: { on: boolean }): Observable<void> {
    if (res.on) {
      return this.streamingService.startStream().pipe(
        catchError((err) => {
          throw new BadRequestException(err);
        })
      );
    } else {
      return this.streamingService.stopStream().pipe(
        catchError((err) => {
          throw new BadRequestException(err);
        })
      );
    }
  }

  @Get('started')
  onStreamStarted(): void {
    this.loggerService.log('stream started');
    this.streamingService.setStreaming(true);
  }

  @Get('stopped')
  onStreamStopped(): void {
    this.loggerService.log('stream stopped');
    this.streamingService.setStreaming(false);
  }
}
