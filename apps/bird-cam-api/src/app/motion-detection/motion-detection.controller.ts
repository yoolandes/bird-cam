import { Body, Controller, Post } from '@nestjs/common';
import { CreateMotionDetectionDto } from './dto/create-motion-detection.dto';
import { MotionDetectionEventsService } from './motion-detection-events.service';

@Controller('motion')
export class MotionDetectionController {
  constructor(
    private readonly motionDetectionService: MotionDetectionEventsService
  ) {}

  @Post()
  create(@Body() { motionDetected }: CreateMotionDetectionDto) {
    return this.motionDetectionService.setMotionDetected(motionDetected);
  }
}
