import { Component, Input } from '@angular/core';
import { Comment } from '../../domain/model/comment.model';

@Component({
  selector: 'bird-cam-comments-detail',
  templateUrl: './comments-detail.component.html',
  styleUrls: ['./comments-detail.component.scss'],
})
export class CommentsDetailComponent {
  @Input() comment?: Comment;
  @Input() lines: 'full' | 'none' = 'full';
}
