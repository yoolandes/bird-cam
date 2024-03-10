import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const PushSubscriberActions = createActionGroup({
  source: 'PushSubscriber',
  events: {
    Subscribe: emptyProps(),
    'Subscribe Success': emptyProps(),
    'Subscribe Failure': props<{ error: unknown }>(),
    UnSubscribe: emptyProps(),
    'UnSubscribe Success': emptyProps(),
    'UnSubscribe Failure': props<{ error: unknown }>(),
    'Is Enabled': props<{ isEnabled: boolean }>(),
  },
});
