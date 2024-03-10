import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PushSubscriberDataService {
  constructor(private readonly httpClient: HttpClient) {}

  add(pushSubscriptionJSON: PushSubscriptionJSON): Observable<void> {
    return this.httpClient.post<void>('/api/push-subscription', {
      pushSubscriptionJSON,
    });
  }

  getVapidPublicKey(): Observable<{ vapidPublicKey: string }> {
    return this.httpClient.get<{
      vapidPublicKey: string;
    }>('/api/vapid');
  }
}
