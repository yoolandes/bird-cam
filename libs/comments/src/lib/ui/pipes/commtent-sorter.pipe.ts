import {Pipe, PipeTransform} from '@angular/core';
import { Comment } from '../../domain/model/comment.model';

@Pipe({
  name: 'commtentSort'
})
export class CommentSortPipe implements PipeTransform {

  transform(comments: Comment[]): Comment[] {
    return comments.sort((a, b) => (b.id || 0) - (a.id || 0));
  }

}
