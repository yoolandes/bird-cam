import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { map, Observable } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class JanusApiService {
  private readonly janusRestUrl: string;
  private readonly janusAdminUrl: string;
  private readonly janusAdminSecret: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.janusRestUrl = this.configService.getOrThrow<string>('JANUS_REST_URL');
    this.janusAdminUrl =
      this.configService.getOrThrow<string>('JANUS_ADMIN_URL');
    this.janusAdminSecret =
      this.configService.getOrThrow<string>('JANUS_ADMIN_SECRET');
  }

  listSessions(): Observable<any[]> {
    return this.postJanus('list_sessions').pipe(map((res) => res.sessions));
  }

  listHandles(session: string): Observable<any> {
    return this.postJanus('list_handles', session);
  }

  handleInfo(session: string, handle: string): Observable<any> {
    return this.postJanus('handle_info', session + '/' + handle);
  }

  listParticipants(path?: string): Observable<any> {
    const data = JSON.stringify({
      janus: 'message',
      admin_secret: this.janusAdminSecret,
      transaction: crypto.randomUUID(),
      body: {
        request: 'listparticipants',
        room: 1234,
      },
    });
    return this.httpService
      .post(this.janusRestUrl + path, data)
      .pipe(map((res) => res.data.plugindata.data.participants));
  }

  private postJanus(janus: string, path?: string): Observable<any> {
    const data = JSON.stringify({
      janus,
      transaction: crypto.randomUUID(),
      admin_secret: this.janusAdminSecret,
    });
    return this.httpService
      .post(this.janusAdminUrl + path, data)
      .pipe(map((res) => res.data));
  }
}
