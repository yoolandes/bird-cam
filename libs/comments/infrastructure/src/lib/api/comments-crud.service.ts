import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment, CreateCommentDto } from '@bird-cam/comments/model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommentsCrudService {
  constructor(private readonly httpClient: HttpClient) {}

  getComments(): Observable<Comment[]> {
    return this.httpClient.get<Comment[]>('/api/comment');
  }

  addComment(comment: CreateCommentDto): Observable<Comment> {
    return this.httpClient.post<Comment>('/api/comment', comment);
  }

  updateComment(comment: Comment): Observable<Comment> {
    return this.httpClient.put<Comment>('/api/comment', comment);
  }
}
