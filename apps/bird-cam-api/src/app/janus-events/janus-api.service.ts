import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { map, Observable } from 'rxjs';

@Injectable()
export class JanusApiService {
  constructor(private readonly httpService: HttpService) {}

  listSessions(): Observable<any> {
    return this.postJanus('list_sessions').pipe(map((res) => res.sessions));
  }

  listHandles(session: string): Observable<any> {
    return this.postJanus('list_handles', session);
  }

  handleInfo({session, handle}: {session: string, handle: string}): Observable<any> {
    return this.postJanus('handle_info', session + '/' + handle);
  }

  private postJanus(janus: string, path?: string): Observable<any> {
    const data = JSON.stringify({
      janus: janus,
      transaction: '1234',
      admin_secret: 'janusoverlord',
    });
    return this.httpService
      .post('http://192.168.178.80:7088/admin/' + path, data)
      .pipe(map((res) => res.data));
  }

  startBirdCam(): Observable<any> {
    return this.httpService.get(
      'https://nistkasten.my-router.de/janus?gateway_url=http%3A%2F%2Fyoolan.my-router.de&room=1234&username=nk&action=Start&gateway_root=%2Fjanus'
    );
  }

  stopBirdcam(): Observable<any> {
    return this.httpService.get(
      'https://nistkasten.my-router.de/janus?action=Stop'
    );
  }
}
