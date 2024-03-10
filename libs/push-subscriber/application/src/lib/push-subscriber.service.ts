import { Injectable } from '@angular/core';
import {
  PushSubscriberActions,
  selectShowSubscription,
} from '@bird-cam/push-subscriber/infrastructure';
import { Store } from '@ngrx/store';
import { SwPush } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class PushSubscriberService {
  showSubscription$ = this.store.select(selectShowSubscription);

  constructor(private readonly store: Store, private readonly swPush: SwPush) {
    this.swPush.notificationClicks.subscribe(console.log);
    this.swPush.subscription.subscribe(console.log);
    this.swPush.messages.subscribe(console.log);
  }

  requestSubscription(): void {
    this.store.dispatch(PushSubscriberActions.subscribe());
  }

  unsubscribe() {
    this.store.dispatch(PushSubscriberActions.unSubscribe());
  }
}
