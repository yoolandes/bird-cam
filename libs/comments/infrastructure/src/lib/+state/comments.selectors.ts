import { createFeatureSelector, createSelector } from '@ngrx/store';
import {
  commentsAdapter,
  CommentsState,
  COMMENTS_FEATURE_KEY,
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

const selectCommentsCount = createSelector(
  selectAllComments,
  (comments) => comments.length
);

const selectMostRecentComment = createSelector(
  selectAllComments,
  (comments) => comments.sort((a, b) => (b.id || 0) - (a.id || 0))[0]
);

export const CommentsSelectors = {
  selectCommentsLoaded,
  selectAllComments,
  selectCommentsCount,
  selectMostRecentComment,
};
