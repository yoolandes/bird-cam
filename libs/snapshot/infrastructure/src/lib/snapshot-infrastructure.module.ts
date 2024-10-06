import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import * as fromSnapshots from './+state/snapshots.reducer';
import { EffectsModule } from '@ngrx/effects';
import { SnapshotsEffects } from './+state/snapshots.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      fromSnapshots.snapshotsFeatureKey,
      fromSnapshots.reducer
    ),
    EffectsModule.forFeature([SnapshotsEffects]),
  ],
})
export class SnapshotInfrastructureModule {}
