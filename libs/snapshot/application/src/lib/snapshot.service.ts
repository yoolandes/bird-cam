import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { SnapshotsActions } from '../../../infrastructure/src/lib/+state/snapshots.actions';
import { selectSnapshots } from '../../../infrastructure/src/lib/+state/snapshots.selectors';

@Injectable({
  providedIn: 'root',
})
export class SnapshotService {
  readonly snapshots$ = this.store.select(selectSnapshots);

  constructor(private readonly store: Store) {}

  loadSnapshots(): void {
    this.store.dispatch(SnapshotsActions.loadSnapshots());
  }
}
