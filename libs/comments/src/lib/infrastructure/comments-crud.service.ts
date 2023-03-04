import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Comment } from '../domain/model/comment.model';


@Injectable({
  providedIn: 'root'
})
export class CommentsCrudService {

  constructor(private readonly httpClient: HttpClient) {
  }

  getComments(): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>('/api/comments');
  }

  addComment(comment: Comment): Observable<Comment> {
    return this.httpClient.post<Comment>('/api/comments', comment);
  }

  updateComment(comment: Comment): Observable<Comment> {
    return this.httpClient.put<Comment>('/api/comments', comment);
  }

  getCommentsCounts(): Observable<string> {
    return this.httpClient.head<string>('/api/comments', {observe: 'response'}).pipe(map(resp => resp.headers.get('X-Total-Count') + ''));
  }
}
