import { createReducer, on } from '@ngrx/store';
import { ActiveViewerActions } from './active-viewers.actions';

export const activeViewersFeatureKey = 'activeViewers';

export interface State {
  activeViewers: { [key: number]: number };
}

export const initialState: State = {
  activeViewers: {},
};

export const reducer = createReducer(
  initialState,
  on(
    ActiveViewerActions.getViewerHistorySuccess,
    (state, { activeViewers }) => ({
      ...state,
      activeViewers,
    })
  )
);
