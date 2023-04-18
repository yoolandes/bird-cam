import { Body, Controller, Post } from '@nestjs/common';
import { BrightnessEventsService } from './brightness-events.service';

@Controller('brightness')
export class BrightnessController {
  constructor(
    private readonly brightnessEventsService: BrightnessEventsService
  ) {}
  @Post()
  create(@Body() { brightness }: { brightness: number }) {
    this.brightnessEventsService.publish(brightness);
  }
}
