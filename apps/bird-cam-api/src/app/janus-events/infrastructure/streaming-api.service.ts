import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';

export interface SessionInfo {
  sessionId: string;
  handle: string;
}

export interface Mountpoint {
  id: number;
  type: string;
  description: string;
  enabled: boolean;
}

@Injectable()
export class StreamingApiService {
  private readonly apiUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiUrl =
      this.configService.getOrThrow<string>('BIRDCAM_HOST') + '/api/streaming';
  }

  start(): Observable<boolean> {
    return this.httpService
      .put(this.apiUrl, { on: true })
      .pipe(map(({ body }: any) => body));
  }

  stop(): Observable<boolean> {
    return this.httpService
      .put(this.apiUrl, { on: false })
      .pipe(map(({ body }: any) => body));
  }
}
