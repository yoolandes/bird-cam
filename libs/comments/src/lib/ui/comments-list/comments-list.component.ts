import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CommentsCrudService } from '../../infrastructure/comments-crud.service';

@Component({
  selector: 'bird-cam-comments-list',
  templateUrl: './comments-list.component.html',
  styleUrls: ['./comments-list.component.css']
})
export class CommentsListComponent {

  readonly comments$ = this.commentsCrudService.getComments();

  constructor(
    private readonly commentsCrudService: CommentsCrudService,
    readonly modalController: ModalController,
    ) {

  }

}
