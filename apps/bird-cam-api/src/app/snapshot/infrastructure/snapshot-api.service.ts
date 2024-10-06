import { Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SnapshotApiService {
  private readonly apiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiUrl =
      this.configService.getOrThrow<string>('BIRDCAM_HOST') + '/api/snapshot';
  }

  getSnapshot(): Observable<string> {
    return this.httpService.get(this.apiUrl).pipe(map((res) => res.data));
  }
}
