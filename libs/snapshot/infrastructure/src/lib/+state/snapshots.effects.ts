import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { SnapshotsActions } from './snapshots.actions';
import { SnapshotDataService } from '../snapshot-data.service';
import { SnapshotCause } from '@bird-cam/snapshot/model';

@Injectable()
export class SnapshotsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly snapshotDataService: SnapshotDataService
  ) {}

  loadSnapshots$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SnapshotsActions.loadSnapshots),
      exhaustMap(() =>
        this.snapshotDataService
          .getSnapshots({
            limit: 10,
            sortBy: ['date:DESC'],
            'filter.snapshotCause': '$eq:' + SnapshotCause.Motion,
          })
          .pipe(
            map((snapshots) =>
              SnapshotsActions.loadSnapshotsSuccess({
                snapshots,
              })
            ),
            catchError((error) =>
              of(
                SnapshotsActions.loadSnapshotsFailure({
                  error,
                })
              )
            )
          )
      )
    );
  });
}
