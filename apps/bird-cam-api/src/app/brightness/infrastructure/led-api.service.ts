import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, map } from 'rxjs';

@Injectable()
export class LedApiService {
  private readonly apiUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.apiUrl =
      this.configService.getOrThrow<string>('BIRDCAM_HOST') + '/api/led';
  }

  switchOn(): Observable<void> {
    return this.httpService
      .put(this.apiUrl, { on: true })
      .pipe(map(() => void 0));
  }

  switchOff(): Observable<void> {
    return this.httpService
      .put(this.apiUrl, { on: false })
      .pipe(map(() => void 0));
  }
}
