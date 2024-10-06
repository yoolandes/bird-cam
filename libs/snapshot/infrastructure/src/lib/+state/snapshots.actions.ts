import { createAction, props } from '@ngrx/store';
import { Snapshot } from '@bird-cam/snapshot/model';

const loadSnapshots = createAction('[Snapshots Page] Load Snapshots');

const loadSnapshotsSuccess = createAction(
  '[Snapshots Page] Load Snapshots Success',
  props<{ snapshots: Snapshot[] }>()
);

const loadSnapshotsFailure = createAction(
  '[Snapshots Page] Load Snapshots Failure',
  props<{ error: any }>()
);
export const SnapshotsActions = {
  loadSnapshots,
  loadSnapshotsSuccess,
  loadSnapshotsFailure,
};
