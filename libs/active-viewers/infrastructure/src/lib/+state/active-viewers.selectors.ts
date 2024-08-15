import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromActiveViewers from './active-viewers.reducer';

const selectActiveViewersState = createFeatureSelector<fromActiveViewers.State>(
  fromActiveViewers.activeViewersFeatureKey
);

const selectViewerHistory = createSelector(
  selectActiveViewersState,
  ({ activeViewers }) => activeViewers
);

export const ActiveViewersSelectors = {
  selectViewerHistory,
};
