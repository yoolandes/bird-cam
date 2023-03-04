import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommentsCrudService } from '../../infrastructure/comments-crud.service';
import { CommentsListComponent } from '../comments-list/comments-list.component';

@Component({
  selector: 'bird-cam-comments-preview',
  templateUrl: './comments-preview.component.html',
})
export class CommentsPreviewComponent {

  readonly commentsCount$ = this.commentsCrudService.getCommentsCounts();

  constructor(
    private readonly commentsCrudService: CommentsCrudService,
    private readonly modalController: ModalController,
    ) {

  }

  async openCommentsList(): Promise<void> {
    const modal = await this.modalController.create({
      component: CommentsListComponent,
      breakpoints: [0, 0.66, 1],
      initialBreakpoint: 0.66
    });
    modal.present();
  }

}
