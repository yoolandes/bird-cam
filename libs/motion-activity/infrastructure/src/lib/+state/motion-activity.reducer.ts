import { createReducer, on } from '@ngrx/store';
import { MotionActivityActions } from './motion-activity.actions';

export const motionActivityFeatureKey = 'motionActivity';

export interface State {
  motionActivity: { [key: number]: number };
}

export const initialState: State = {
  motionActivity: {},
};

export const reducer = createReducer(
  initialState,
  on(
    MotionActivityActions.getMotionActivitySuccess,
    (state, { motionActivity }) => ({
      ...state,
      motionActivity,
    })
  )
);
