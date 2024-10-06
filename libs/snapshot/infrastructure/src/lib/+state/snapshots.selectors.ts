import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSnapshots from './snapshots.reducer';

export const selectSnapshotsState = createFeatureSelector<fromSnapshots.State>(
  fromSnapshots.snapshotsFeatureKey
);

export const selectSnapshots = createSelector(
  selectSnapshotsState,
  (state) => state.snapshots
);
