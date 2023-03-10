import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  commentsAdapter, CommentsState, COMMENTS_FEATURE_KEY
} from './comments.reducer';

const selectCommentsState =
  createFeatureSelector<CommentsState>(COMMENTS_FEATURE_KEY);

const { selectAll } = commentsAdapter.getSelectors();

const selectCommentsLoaded = createSelector(
  selectCommentsState,
  (state: CommentsState) => state.loaded
);

const selectAllComments = createSelector(
  selectCommentsState,
  (state: CommentsState) => selectAll(state)
);


export const CommentsSelectors = {
  selectCommentsLoaded,
  selectAllComments
};
