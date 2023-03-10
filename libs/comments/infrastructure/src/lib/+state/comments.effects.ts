import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, filter, map, of, switchMap } from 'rxjs';
import { CommentsCrudService } from '../api/comments-crud.service';
import { CommentsActions } from './comments.actions';
import { CommentsSelectors } from './comments.selectors';

@Injectable()
export class CommentsEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly commentsCrudService: CommentsCrudService,
    private readonly store: Store
  ) {}

  loadComments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentsActions.loadComments),
      concatLatestFrom(() =>
        this.store.select(CommentsSelectors.selectCommentsLoaded)
      ),
      filter(([_, commentsLoaded]) => !commentsLoaded),
      switchMap(() =>
        this.commentsCrudService.getComments().pipe(
          map((comments) => CommentsActions.loadCommentsSuccess({ comments })),
          catchError((error) => {
            console.error('Error', error);
            return of(CommentsActions.loadCommentsFailure({ error }));
          })
        )
      )
    )
  );

  addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentsActions.addComment),
      switchMap(({ comment }) =>
        this.commentsCrudService.addComment(comment).pipe(
          map((comment) => CommentsActions.addCommentSuccess({ comment })),
          catchError((error) => {
            console.error('Error', error);
            return of(CommentsActions.addCommentFailure({ error }));
          })
        )
      )
    )
  );
}
