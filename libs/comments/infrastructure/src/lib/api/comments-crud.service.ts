import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Comment, CreateCommentDto } from '@bird-cam/comments/model';


@Injectable({
  providedIn: 'root'
})
export class CommentsCrudService {

  constructor(private readonly httpClient: HttpClient) {
  }

  getComments(): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>('/api/comment');
  }

  addComment(comment: CreateCommentDto): Observable<Comment> {
    return this.httpClient.post<Comment>('/api/comment', comment);
  }

  updateComment(comment: Comment): Observable<Comment> {
    return this.httpClient.put<Comment>('/api/comment', comment);
  }

  getCommentsCounts(): Observable<string> {
    return this.httpClient.head<string>('/api/comment', {observe: 'response'}).pipe(map(resp => resp.headers.get('X-Total-Count') + ''));
  }
}
