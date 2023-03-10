import {Pipe, PipeTransform} from '@angular/core';
import { Comment } from '@bird-cam/comments/model';

@Pipe({
  name: 'commtentSort'
})
export class CommentSortPipe implements PipeTransform {

  transform(comments: Comment[]): Comment[] {
    return comments.sort((a, b) => (b.id || 0) - (a.id || 0));
  }

}
