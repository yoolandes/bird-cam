import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { map, Observable, of, switchMap, tap } from 'rxjs';

@Injectable()
export class JanusApiService {
  constructor(private readonly httpService: HttpService) {}

  listSessions(): Observable<[]> {
    return this.postJanus('list_sessions').pipe(map((res) => res.sessions));
  }

  listHandles(session: string): Observable<any> {
    return this.postJanus('list_handles', session);
  }

  handleInfo(session, handle): Observable<any> {
    return this.postJanus('handle_info', session + '/' + handle);
  }

  listParticipants(path?: string): Observable<any> {
    const data = JSON.stringify({
      janus: 'message',
      admin_secret: 'janusoverlord',
      transaction: '12345',
      body: {
        request: 'listparticipants',
        room: 1234,
      },
    });
    return this.httpService
      .post('http://192.168.178.80:8088/janus/' + path, data)
      .pipe(map((res) => res.data.plugindata.data.participants));
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

  startBirdCam(): any {
    return this.httpService
      .get('https://nistkasten.my-router.de/api/janus/client/settings')
      .pipe(
        switchMap(({ data }: any) =>
          this.httpService.put(
            'https://nistkasten.my-router.de/api/janus/client/settings',
            {
              ...data,
              gateway: {
                ...data.gateway,
                url: 'http://yoolan.my-router.de',
              },
            }
          )
        ),
        switchMap(() =>
          this.httpService.get(
            'https://nistkasten.my-router.de/api/janus/client'
          )
        ),
        switchMap(({ data }) =>
          data.session_id
            ? of(void 0)
            : this.httpService.post(
                'https://nistkasten.my-router.de/api/janus/client',
                {
                  what: 'create',
                  plugin: 'videoroom',
                  transaction: '1a1e34e4-162e-66b3-3d29-9ca9e90408b3',
                }
              )
        ),
        switchMap(() =>
          this.httpService.post(
            'https://nistkasten.my-router.de/api/janus/client/videoroom',
            {
              what: 'join',
              transaction: '0dbeddce-f252-bc60-06cf-7e50de1e67e3',
              body: {
                room: 1234,
                username: 'nk',
              },
            }
          )
        ),
        switchMap(() =>
          this.httpService.post(
            'https://nistkasten.my-router.de/api/janus/client/videoroom',
            {
              what: 'publish',
              transaction: '1f1b976c-f452-ead4-3c84-4fd50f7f6c8d',
              body: {
                audio: false,
                video: true,
                data: false,
                adjust_max_bitrate_for_hardware_videocodec: true,
                max_bitrate_bits: 0,
                use_hardware_videocodec: true,
                video_format_id: 95,
                record: false,
                rec_filename: 'myrecording',
              },
            }
          )
        ),
        map(({ data }) => data),
        tap(console.log)
      );
  }

  stopBirdcam(): any {
    return this.httpService.post(
      'https://nistkasten.my-router.de/api/janus/client',
      {
        what: 'destroy',
        plugin: 'videoroom',
        transaction: '312ee43f-e7ec-ab82-495c-9929d0e7f2bc',
      }
    );
  }
}
