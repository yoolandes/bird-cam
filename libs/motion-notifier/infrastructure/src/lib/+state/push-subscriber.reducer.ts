import { createFeature, createReducer, on } from '@ngrx/store';
import { PushSubscriberActions } from './push-subscriber.actions';

export const pushSubscriberFeatureKey = 'pushSubscriber';

export interface State {
  isEnabled: boolean;
}

export const initialState: State = {
  isEnabled: false,
};

export const reducer = createReducer(
  initialState,
  on(PushSubscriberActions.isEnabled, (state, { isEnabled }) => ({
    ...state,
    isEnabled,
  }))
);

export const pushSubscriberFeature = createFeature({
  name: pushSubscriberFeatureKey,
  reducer,
});
