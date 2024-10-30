import { Injectable } from '@angular/core';
import { ActiveViewers } from '@bird-cam/active-viewers/model';
import {
  catchError,
  fromEvent,
  merge,
  Observable,
  of,
  shareReplay,
} from 'rxjs';
import { io } from 'socket.io-client';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ActiveViewersDataService {
  activeViewers$: Observable<ActiveViewers> = merge(
    fromEvent<ActiveViewers>(
      io(location.host + '/events', { path: '/api/events' }),
      'activeViewers'
    ),
    this.getActiveViewers().pipe(catchError(() => of({ activeViewers: 1 })))
  ).pipe(shareReplay());

  constructor(private readonly httpClient: HttpClient) {}

  private getActiveViewers(): Observable<ActiveViewers> {
    return this.httpClient.get<ActiveViewers>('/api/active-viewers');
  }

  getViewerActivity(hours: number): Observable<{ [key: number]: number }> {
    const params = new HttpParams().set('hours', hours);
    return this.httpClient.get<{ [key: number]: number }>('api/view-activity', {
      params,
    });
  }
}
