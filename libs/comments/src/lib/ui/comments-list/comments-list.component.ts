import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Comment } from '../../domain/model/comment.model';
import { CommentsCrudService } from '../../infrastructure/comments-crud.service';

@Component({
  selector: 'bird-cam-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.css']
})
export class CommentsListComponent {

  comments$ = this.commentsCrudService.getComments();

  constructor(
    private readonly commentsCrudService: CommentsCrudService,
    readonly modalController: ModalController,
    ) {

  }

  addComment(comment: Comment): void {
    this.commentsCrudService.addComment(comment).subscribe(newComment => {
      this.comments$ =  this.commentsCrudService.getComments();
    });
  }

}
