import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromMotionActivity from './motion-activity.reducer';

const selectMotionActivityState =
  createFeatureSelector<fromMotionActivity.State>(
    fromMotionActivity.motionActivityFeatureKey
  );

const selectMotionActivity = createSelector(
  selectMotionActivityState,
  ({ motionActivity }) => motionActivity
);

export const MotionActivitySelectors = {
  selectMotionActivity,
};
