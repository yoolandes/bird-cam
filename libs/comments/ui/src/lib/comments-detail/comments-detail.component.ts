import { Component, Input } from '@angular/core';
import { Comment } from '@bird-cam/comments/model';

@Component({
  selector: 'bird-cam-comments-detail',
  templateUrl: './comments-detail.component.html'
})
export class CommentsDetailComponent {
  @Input() comment?: Comment;
  @Input() lines: 'full' | 'none' = 'full';
}
