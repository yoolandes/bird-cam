import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Paginated } from 'nestjs-paginate';
import { Snapshot } from '@bird-cam/snapshot/model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SnapshotDataService {
  constructor(private readonly httpClient: HttpClient) {}

  getSnapshots(query: any): Observable<Snapshot[]> {
    return this.httpClient
      .get<Paginated<Snapshot>>('/api/snapshot', {
        params: new HttpParams({
          fromObject: query as any,
        }),
      })
      .pipe(map((res) => res.data));
  }
}
