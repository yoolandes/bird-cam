import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { map, Observable, tap } from 'rxjs';
import { Mountpoint, SessionInfo } from './streaming-api.service';
import { LoggerService } from '@bird-cam/logger';

@Injectable()
export class JanusStreamingApiService {
  private readonly janusRestUrl: string;
  private readonly janusStreamingAdminKey: string;
  private readonly birdcamRTSP: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService
  ) {
    this.janusRestUrl = this.configService.getOrThrow<string>('JANUS_REST_URL');
    this.janusStreamingAdminKey = this.configService.getOrThrow<string>(
      'JANUS_STREAMING_ADMIN_KEY'
    );
    this.birdcamRTSP = this.configService.getOrThrow<string>('BIRDCAM_RTSP');
  }

  createMountpoint(sessionInfo: SessionInfo): Observable<void> {
    const data = JSON.stringify({
      janus: 'message',
      transaction: crypto.randomUUID(),
      body: {
        request: 'create',
        admin_key: this.janusStreamingAdminKey,
        type: 'rtsp',
        id: 99,
        url: 'rtsp://' + this.birdcamRTSP,
        video: true,
        audio: false,
        secret: this.janusStreamingAdminKey,
        audioport: 0,
        audiopt: 11,
        audiortpmap: 'L16/44100',
        audioskew: false,
        media: [
          {
            audioport: 0,
            audiopt: 11,
            audiortpmap: 'L16/44100',
            audioskew: false,
          },
          {
            type: 'video',
            videortpmap: 'H264/90000',
            videofmtp: 'profile-level-id=42e01f;packetization-mode=1',
          },
        ],
        rtsp_reconnect_delay: 5,
        rtsp_session_timeout: 0,
        rtsp_timeout: 10,
        rtsp_conn_timeout: 5,
        rtsp_failcheck: false,
        permanent: false,
      },
    });
    return this.httpService
      .post(
        this.janusRestUrl + sessionInfo.sessionId + '/' + sessionInfo.handle,
        data
      )
      .pipe(
        map(this.checkError),
        map(() => void 0)
      );
  }

  listMountpoints(sessionInfo: SessionInfo): Observable<Mountpoint[]> {
    const data = JSON.stringify({
      janus: 'message',
      transaction: crypto.randomUUID(),
      body: {
        request: 'list',
      },
    });
    return this.httpService
      .post(
        this.janusRestUrl + sessionInfo.sessionId + '/' + sessionInfo.handle,
        data
      )
      .pipe(
        map(this.checkError),
        map((res) => res.data.plugindata.data.list)
      );
  }

  deleteMountpoint(
    sessionInfo: SessionInfo,
    id: number
  ): Observable<Mountpoint[]> {
    this.loggerService.log('Deleting Mountpoint');
    const data = JSON.stringify({
      janus: 'message',
      transaction: crypto.randomUUID(),
      body: {
        request: 'destroy',
        secret: this.janusStreamingAdminKey,
        id,
      },
    });
    return this.httpService
      .post(
        this.janusRestUrl + sessionInfo.sessionId + '/' + sessionInfo.handle,
        data
      )
      .pipe(
        map(this.checkError),
        map((res) => res.data.plugindata.data.list),
        tap(() => this.loggerService.log('Mountpoint deleted'))
      );
  }

  private checkError(res: any) {
    if (res.data.janus === 'error') {
      throw new Error(res.data.error.reason);
    }
    return res;
  }
}
