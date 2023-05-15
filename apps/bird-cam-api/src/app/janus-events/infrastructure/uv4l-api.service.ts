import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import {
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

export interface SessionInfo {
  sessionId: string;
  handle: string;
}

@Injectable()
export class Uv4lApiService {
  private readonly birdcamHost: string;
  private readonly janusGateway: string;
  private readonly janusUsername: string;
  private readonly janusRoom: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.birdcamHost =
      this.configService.getOrThrow<string>('BIRDCAM_HOST') + '/api/janus';
    this.janusGateway = this.configService.getOrThrow<string>('JANUS_GATEWAY');
    this.janusUsername =
      this.configService.getOrThrow<string>('JANUS_USERNAME');
    this.janusRoom = this.configService.getOrThrow<string>('JANUS_ROOM');
  }

  getPath(): Observable<SessionInfo> {
    return this.putGateway().pipe(
      switchMap(() => this.httpService.get(this.birdcamHost + '/client')),
      map(({ data }) => ({
        sessionId: data.session_id,
        handle: data.plugins[0]?.id,
      }))
    );
  }

  createSession(): Observable<SessionInfo> {
    return this.httpService
      .post(this.birdcamHost + '/client', {
        what: 'create',
        plugin: 'videoroom',
        transaction: this.getTransaction(),
      })
      .pipe(
        map(({ data }) => ({
          sessionId: data.session_id,
          handle: data.plugins[0]?.id,
        })),
        catchError((err) => {
          console.log(err);
          return of(err);
        })
      );
  }

  private getTransaction(): string {
    return crypto.randomUUID();
  }

  putGateway(): Observable<any> {
    return this.httpService.get(this.birdcamHost + '/client/settings').pipe(
      tap(({ data }) => console.log(data.gateway.url)),
      switchMap(({ data }: any) =>
        data.gateway.url
          ? of(void 0)
          : this.httpService.put(this.birdcamHost + '/client/settings', {
              ...data,
              gateway: {
                ...data.gateway,
                url: this.janusGateway,
              },
            })
      )
    );
  }

  join(): Observable<void> {
    this.httpService
      .post(this.birdcamHost + '/client/videoroom', {
        what: 'join',
        transaction: this.getTransaction(),
        body: {
          room: this.janusRoom,
          username: this.janusUsername,
        },
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          return of(err);
        })
      )
      .subscribe();
    return of(void 0);
  }

  publish(): Observable<any> {
    return this.httpService
      .post(this.birdcamHost + '/client/videoroom', {
        what: 'publish',
        transaction: this.getTransaction(),
        body: {
          audio: false,
          video: true,
          data: false,
          adjust_max_bitrate_for_hardware_videocodec: true,
          max_bitrate_bits: 0,
          use_hardware_videocodec: true,
          video_format_id: 30,
          record: false,
        },
      })
      .pipe(
        catchError((err) => {
          console.log(err);
          return of(err);
        })
      );
  }

  unpublish(): Observable<any> {
    return this.httpService
      .post(this.birdcamHost + '/client/videoroom', {
        what: 'unpublish',
        transaction: this.getTransaction(),
      })
      .pipe(
        catchError((err) => {
          console.log('unpub');
          console.log(err);
          return of(err);
        })
      );
  }

  destroy(): Observable<any> {
    return this.httpService
      .post(this.birdcamHost + '/client', {
        what: 'destroy',
        plugin: 'videoroom',
        transaction: this.getTransaction(),
      })
      .pipe(
        catchError((err) => {
          console.log('dest');
          console.log(err);
          return of(err);
        })
      );
  }

  stop(): Observable<any> {
    return this.httpService
      .get('http://192.168.178.46:8080/janus?action=Stop')
      .pipe(
        catchError((err) => {
          console.log('stop');
          console.log(err);
          return of(err);
        })
      );
  }
}
