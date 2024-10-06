import { createFeature, createReducer, on } from '@ngrx/store';
import { SnapshotsActions } from './snapshots.actions';
import { Snapshot } from '@bird-cam/snapshot/model';

export const snapshotsFeatureKey = 'snapshots';

export interface State {
  snapshots: Snapshot[];
}

export const initialState: State = {
  snapshots: [],
};

export const reducer = createReducer(
  initialState,
  on(SnapshotsActions.loadSnapshotsSuccess, (state, { snapshots }) => ({
    ...state,
    snapshots,
  }))
);

export const snapshotsFeature = createFeature({
  name: snapshotsFeatureKey,
  reducer,
});
