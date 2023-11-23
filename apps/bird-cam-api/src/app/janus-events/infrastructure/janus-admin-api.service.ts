import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { map, Observable } from 'rxjs';

@Injectable()
export class JanusAdminApiService {
  private readonly janusAdminUrl: string;
  private readonly janusAdminSecret: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.janusAdminUrl =
      this.configService.getOrThrow<string>('JANUS_ADMIN_URL');
    this.janusAdminSecret =
      this.configService.getOrThrow<string>('JANUS_ADMIN_SECRET');
  }

  listSessions(): Observable<string[]> {
    return this.postJanus('list_sessions').pipe(map((res) => res.sessions));
  }

  listHandles(session: string): Observable<any> {
    return this.postJanus('list_handles', session);
  }

  handleInfo(session: string, handle: string): Observable<any> {
    return this.postJanus('handle_info', session + '/' + handle);
  }

  private postJanus(janus: string, path?: string): Observable<any> {
    const data = JSON.stringify({
      janus,
      transaction: crypto.randomUUID(),
      admin_secret: this.janusAdminSecret,
    });
    return this.httpService.post(this.janusAdminUrl + path, data).pipe(
      map(this.checkError),
      map((res) => res.data)
    );
  }

  private checkError(res: any) {
    if (res.data.janus === 'error') {
      throw new Error(res.data.error.reason);
    }
    return res;
  }
}
