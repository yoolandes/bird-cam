import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, map, Observable } from 'rxjs';
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

  listParticipants(path: string): Observable<any> {
    const data = JSON.stringify({
      janus: 'message',
      admin_secret: this.janusAdminSecret,
      transaction: crypto.randomUUID(),
      body: {
        request: 'listparticipants',
        room: 1234,
      },
    });
    return this.httpService.post(this.janusRestUrl + path, data).pipe(
      map(this.checkError),
      map((res) => res.data.plugindata.data.participants)
    );
  }

  setRecording(
    session: string,
    handle: string,
    record: boolean
  ): Observable<void> {
    const data = JSON.stringify({
      janus: 'message',
      admin_secret: this.janusAdminSecret,
      transaction: crypto.randomUUID(),
      body: {
        request: 'configure',
        record,
        filename: 'recording',
      },
    });
    return this.httpService
      .post(this.janusRestUrl + session + '/' + handle, data)
      .pipe(
        map(this.checkError),
        map(() => void 0)
      );
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
