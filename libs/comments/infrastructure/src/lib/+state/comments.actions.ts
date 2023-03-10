import { Comment, CreateCommentDto } from '@bird-cam/comments/model';
import { createAction, props } from '@ngrx/store';

const loadComments = createAction('[Comments Page] Load');

const loadCommentsSuccess = createAction(
  '[Comments/API] Load Comments Success',
  props<{ comments: Comment[] }>()
);

const loadCommentsFailure = createAction(
  '[Comments/API] Load Comments Failure',
  props<{ error: any }>()
);

const addComment = createAction(
  '[Comments Page] Add Comment',
  props<{ comment: CreateCommentDto }>()
);

const addCommentSuccess = createAction(
  '[Comments/API] Add Comment Success',
  props<{ comment: Comment}>()
);

const addCommentFailure = createAction(
  '[Comments/API] Add Comment Failure',
  props<{ error: any }>()
);

export const CommentsActions = {
  loadComments,
  loadCommentsSuccess,
  loadCommentsFailure,
  addComment,
  addCommentSuccess,
  addCommentFailure,
};
