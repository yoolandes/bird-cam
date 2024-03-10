import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, EMPTY, from, of, tap } from 'rxjs';
import { SwPush } from '@angular/service-worker';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { PushSubscriberDataService } from '../push-subscriber-data.service';
import { PushSubscriberActions } from './push-subscriber.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class PushSubscriberEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly swPush: SwPush,
    private readonly pushSubscriberDataService: PushSubscriberDataService
  ) {
    this.store.dispatch(
      PushSubscriberActions.isEnabled({ isEnabled: this.swPush.isEnabled })
    );
  }

  subscribe$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PushSubscriberActions.subscribe),
      exhaustMap(() =>
        this.pushSubscriberDataService.getVapidPublicKey().pipe(
          exhaustMap(({ vapidPublicKey }) =>
            this.swPush.requestSubscription({
              serverPublicKey: vapidPublicKey,
            })
          ),
          exhaustMap((pushSubscription) =>
            this.pushSubscriberDataService.add(pushSubscription.toJSON())
          ),
          map(() => PushSubscriberActions.subscribeSuccess()),
          catchError((error) =>
            of(PushSubscriberActions.subscribeFailure({ error }))
          )
        )
      )
    );
  });

  unsubscribe$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PushSubscriberActions.unSubscribe),
      exhaustMap(() =>
        from(this.swPush.unsubscribe()).pipe(
          map(() => PushSubscriberActions.unSubscribeSuccess()),
          catchError((error) => {
            console.log(error);
            return of(PushSubscriberActions.unSubscribeFailure({ error }));
          })
        )
      )
    );
  });
}
