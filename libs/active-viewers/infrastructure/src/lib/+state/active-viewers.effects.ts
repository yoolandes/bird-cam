import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ActiveViewersDataService } from '@bird-cam/active-viewers/infrastructure';
import { ActiveViewerActions } from './active-viewers.actions';

@Injectable()
export class ActiveViewersEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly activeViewersDataService: ActiveViewersDataService
  ) {}

  getViewerActivity$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ActiveViewerActions.getViewerHistory),
      exhaustMap(() =>
        this.activeViewersDataService.getViewerActivity(24).pipe(
          map((activeViewers) =>
            ActiveViewerActions.getViewerHistorySuccess({ activeViewers })
          ),
          catchError((error) => {
            console.error('Error', error);
            return of(ActiveViewerActions.getViewerHistoryFailure({ error }));
          })
        )
      )
    );
  });
}
