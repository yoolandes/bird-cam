import { Injectable } from '@angular/core';
import { CreateCommentDto } from '@bird-cam/comments/model';
import { select, Store } from '@ngrx/store';
import { CommentsActions } from './comments.actions';
import { CommentsSelectors } from './comments.selectors';

@Injectable()
export class CommentsFacade {
  allComments$ = this.store.pipe(select(CommentsSelectors.selectAllComments));
  commentsCount$ = this.store.pipe(select(CommentsSelectors.selectCommentsCount));
  mostRecentComment$ = this.store.pipe(select(CommentsSelectors.selectMostRecentComment));

  constructor(private readonly store: Store) {}

  loadComments(): void {
    this.store.dispatch(CommentsActions.loadComments());
  }

  addComment(comment: CreateCommentDto): void {
    this.store.dispatch(CommentsActions.addComment({comment}));
  }

}
