import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromPushSubscriber from './+state/push-subscriber.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PushSubscriberEffects } from './+state/push-subscriber.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromPushSubscriber.pushSubscriberFeatureKey,
      fromPushSubscriber.reducer
    ),
    EffectsModule.forFeature([PushSubscriberEffects]),
  ],
})
export class PushSubscriberInfrastructureModule {}
