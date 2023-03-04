import { Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { map, Observable, tap } from 'rxjs';


@Injectable()
export class SnapshotService {

  constructor(private readonly httpService: HttpService) { }

  getSnapshot(): Observable<Blob> {
    return this.httpService.get('http://127.0.0.1:8080/stream/snapshot.jpeg')
    .pipe(tap(console.log),map(({ data }) => data));
  }

}
