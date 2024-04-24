import { createAction, props } from '@ngrx/store';

const getMotionActivity = createAction(
  '[Motion Activity Page] Get Motion Activity'
);

const getMotionActivitySuccess = createAction(
  '[Motion Activity Page] Get Motion Activity Success',
  props<{ motionActivity: { [key: number]: number } }>()
);

const getMotionActivityFailure = createAction(
  '[Motion Activity Page] Get Motion Activity Failure',
  props<{ error: any }>()
);

export const MotionActivityActions = {
  getMotionActivity,
  getMotionActivitySuccess,
  getMotionActivityFailure,
};
