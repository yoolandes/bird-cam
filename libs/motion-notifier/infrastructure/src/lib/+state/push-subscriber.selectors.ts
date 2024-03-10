import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPushSubscriber from './push-subscriber.reducer';

export const selectPushSubscriberState =
  createFeatureSelector<fromPushSubscriber.State>(
    fromPushSubscriber.pushSubscriberFeatureKey
  );

export const selectHasSubscribed = createSelector(
  () => Notification.permission === 'granted'
);

export const selectShowSubscription = createSelector(
  selectPushSubscriberState,
  ({ isEnabled }) => isEnabled && Notification.permission !== 'denied'
);
