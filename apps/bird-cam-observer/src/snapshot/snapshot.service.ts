import { HttpService } from "@nestjs/axios";
import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Stream } from 'stream';


@Injectable()
export class SnapshotService {

  constructor(private readonly httpService: HttpService) { }

  getSnapshot(): Observable<Stream> {
    return this.httpService.get('http://127.0.0.1:8080/stream/snapshot.jpeg', { responseType: 'stream' })
    .pipe(map(({ data }) => data));
  }

}
