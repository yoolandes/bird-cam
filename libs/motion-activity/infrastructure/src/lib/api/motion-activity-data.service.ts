import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MotionActivityDataService {
  constructor(private readonly httpClient: HttpClient) {}

  getMotionActivity(hours: number): Observable<{ [key: number]: number }> {
    const params = new HttpParams().set('hours', hours);
    return this.httpClient.get<{ [key: number]: number }>(
      'api/motion-activity',
      {
        params,
      }
    );
  }
}
