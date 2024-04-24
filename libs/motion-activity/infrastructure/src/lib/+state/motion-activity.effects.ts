import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { exhaustMap, map } from 'rxjs/operators';
import { MotionActivityActions } from './motion-activity.actions';
import { MotionActivityDataService } from '../api/motion-activity-data.service';
import { catchError, of } from 'rxjs';

@Injectable()
export class MotionActivityEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly motionActivityDataService: MotionActivityDataService
  ) {}

  getMotionActivitys$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(MotionActivityActions.getMotionActivity),
      exhaustMap(() =>
        this.motionActivityDataService.getMotionActivity(24).pipe(
          map((motionActivity) =>
            MotionActivityActions.getMotionActivitySuccess({ motionActivity })
          ),
          catchError((error) => {
            console.error('Error', error);
            return of(
              MotionActivityActions.getMotionActivityFailure({ error })
            );
          })
        )
      )
    );
  });
}
