import { Injectable } from '@angular/core';
import {
  PushSubscriberActions,
  selectHasSubscribed,
  selectShowSubscription,
} from '@bird-cam/motion-notifier/infrastructure';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class PushSubscriberService {
  showSubscription$ = this.store.select(selectShowSubscription);
  hasSubscribed$ = this.store.select(selectHasSubscribed);

  constructor(private readonly store: Store) {}

  requestSubscription(): void {
    this.store.dispatch(PushSubscriberActions.subscribe());
  }

  unsubscribe() {}
}
