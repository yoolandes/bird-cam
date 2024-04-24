import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromMotionActivity from '../../../../motion-activity/infrastructure/src/lib/+state/motion-activity.reducer';
import { EffectsModule } from '@ngrx/effects';
import { MotionActivityEffects } from './+state/motion-activity.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromMotionActivity.motionActivityFeatureKey,
      fromMotionActivity.reducer
    ),
    EffectsModule.forFeature([MotionActivityEffects]),
  ],
})
export class MotionActivityInfrastructureModule {}
