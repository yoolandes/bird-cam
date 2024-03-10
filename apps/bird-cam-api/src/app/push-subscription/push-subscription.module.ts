import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PushSubscriptionHolderEntity } from './push-subscription-holder.entity';
import { PushSubscriptionController } from './push-subscription.controller';
import { PushSubscriptionService } from './push-subscription.service';
import { VapidKeyController } from './utils/vapid-key.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PushSubscriptionHolderEntity])],
  controllers: [PushSubscriptionController, VapidKeyController],
  providers: [PushSubscriptionService],
  exports: [PushSubscriptionService]
})
export class PushSubscriptionModule {}
