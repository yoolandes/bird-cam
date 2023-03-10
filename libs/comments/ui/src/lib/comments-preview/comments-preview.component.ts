import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommentsFacade } from 'libs/comments/infrastructure/src';
import { CommentsListComponent } from '../comments-list/comments-list.component';

@Component({
  selector: 'bird-cam-comments-preview',
  templateUrl: './comments-preview.component.html',
})
export class CommentsPreviewComponent implements OnInit {

  constructor(
    private readonly modalController: ModalController,
    readonly commentsFacade: CommentsFacade,
    ) {

  }
  ngOnInit(): void {
    this.commentsFacade.loadComments();
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
