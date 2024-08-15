import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import * as fromActiveViewers from './+state/active-viewers.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ActiveViewersEffects } from './+state/active-viewers.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(
      fromActiveViewers.activeViewersFeatureKey,
      fromActiveViewers.reducer
    ),
    EffectsModule.forFeature([ActiveViewersEffects]),
  ],
})
export class ActiveViewersInfrastructureModule {}
