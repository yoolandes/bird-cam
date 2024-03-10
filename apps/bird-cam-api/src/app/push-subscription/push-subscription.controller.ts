import { CreatePushSubscriptionHolderDto } from '@bird-cam/motion-notifier/model';
import { Body, Controller, Post } from '@nestjs/common';
import { PushSubscriptionService } from './push-subscription.service';

@Controller('push-subscription')
export class PushSubscriptionController {
  constructor(
    private readonly pushSubscriptionService: PushSubscriptionService
  ) {}

  @Post()
  create(@Body() pushSubscriptionHolderDto: CreatePushSubscriptionHolderDto) {
    return this.pushSubscriptionService.create(pushSubscriptionHolderDto);
  }
}
