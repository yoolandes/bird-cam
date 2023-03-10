import { Comment } from '@bird-cam/comments/model';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { CommentsActions } from './comments.actions';

export const COMMENTS_FEATURE_KEY = 'comments';

export interface CommentsState extends EntityState<Comment> {
  selectedId?: number;
  loaded: boolean;
  error?: string | null;
}

export interface CommentsPartialState {
  readonly [COMMENTS_FEATURE_KEY]: CommentsState;
}

export const commentsAdapter: EntityAdapter<Comment> =
  createEntityAdapter<Comment>();

export const initialCommentsState: CommentsState =
  commentsAdapter.getInitialState({
    loaded: false,
  });

const reducer = createReducer(
  initialCommentsState,
  on(
    CommentsActions.loadComments,
    CommentsActions.addComment,
    (state) => ({
      ...state,
      error: null,
    })
  ),
  on(CommentsActions.loadCommentsSuccess, (state, { comments }) =>
    commentsAdapter.setAll(comments, { ...state, loaded: true })
  ),
  on(CommentsActions.addCommentSuccess, (state, { comment }) =>
    commentsAdapter.addOne(comment, { ...state })
  ),
  on(
    CommentsActions.loadCommentsFailure,
    CommentsActions.addCommentFailure,
    (state, { error }) => ({
      ...state,
      error,
    })
  )
);

export function commentsReducer(state: CommentsState, action: Action) {
  return reducer(state, action);
}
