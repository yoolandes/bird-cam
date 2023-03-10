import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CreateCommentDto } from '@bird-cam/comments/model';
import { CommentsFacade } from 'libs/comments/infrastructure/src';

@Component({
  selector: 'bird-cam-comments-list',
  templateUrl: './comments-list.component.html'
})
export class CommentsListComponent {

  constructor(
    readonly commentsFacade: CommentsFacade,
    readonly modalController: ModalController,
    ) {

  }

  addComment(comment: CreateCommentDto): void {
    this.commentsFacade.addComment(comment);
  } 

}
