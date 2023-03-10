import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { CommentsFacade } from 'libs/comments/infrastructure/src';
import { CommentsActions } from 'libs/comments/infrastructure/src/lib/+state/comments.actions';
import { CommentsListComponent } from '../comments-list/comments-list.component';

@Component({
  selector: 'bird-cam-comments-preview',
  templateUrl: './comments-preview.component.html',
})
export class CommentsPreviewComponent {

  // readonly commentsCount$ = this.commentsCrudService.getCommentsCounts();

  constructor(
    private readonly modalController: ModalController,
    private readonly commentsFacade: CommentsFacade,
    ) {

  }

  async openCommentsList(): Promise<void> {
    this.commentsFacade.loadComments();
    const modal = await this.modalController.create({
      component: CommentsListComponent,
      breakpoints: [0, 0.66, 1],
      initialBreakpoint: 0.66
    });
    modal.present();
  }

}
