import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HealthPingDataService {
  constructor(private readonly httpClient: HttpClient) {}

  getHealthPing(): Observable<string> {
    return this.httpClient.get<string>('/api/health-ping');
  }
}
