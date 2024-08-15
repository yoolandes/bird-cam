import { createAction, props } from '@ngrx/store';

const getViewerHistory = createAction(
  '[Active Viewers Page] Get Viewer History'
);

const getViewerHistorySuccess = createAction(
  '[Active Viewers Page] Get Viewer History Success',
  props<{ activeViewers: { [key: number]: number } }>()
);

const getViewerHistoryFailure = createAction(
  '[Active Viewers Page] Get Viewer History Failure',
  props<{ error: any }>()
);

export const ActiveViewerActions = {
  getViewerHistory,
  getViewerHistorySuccess,
  getViewerHistoryFailure,
};
