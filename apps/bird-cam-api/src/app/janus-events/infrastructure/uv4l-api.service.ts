import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

import { createRxJsQueue } from '@bird-cam/rxjs-queue';
import { LoggerService } from '@bird-cam/logger';

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

  private readonly queue = createRxJsQueue();

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService
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
      tap(() => this.loggerService.log('getPath')),
      map(({ data }) => ({
        sessionId: data.session_id,
        handle: data.plugins[0]?.id,
      })),
      this.queue()
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
        tap(() => this.loggerService.log('createSession')),
        map(({ data }) => ({
          sessionId: data.session_id,
          handle: data.plugins[0]?.id,
        }))
      );
  }

  private getTransaction(): string {
    return crypto.randomUUID();
  }

  putGateway(): Observable<any> {
    return this.httpService.get(this.birdcamHost + '/client/settings').pipe(
      tap(() => this.loggerService.log('putGateway')),
      switchMap(({ data }: any) =>
        data.gateway.url
          ? of(void 0)
          : this.httpService
              .put(this.birdcamHost + '/client/settings', {
                ...data,
                gateway: {
                  ...data.gateway,
                  url: this.janusGateway,
                },
              })
              .pipe(this.queue())
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
        tap(() => this.loggerService.log('join')),
        this.queue()
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
          max_bitrate_bits: 900000,
          use_hardware_videocodec: true,
          video_format_id: 30,
          record: false,
        },
      })
      .pipe(
        tap(() => this.loggerService.log('publish')),
        this.queue()
      );
  }

  unpublish(): Observable<any> {
    return this.httpService
      .post(this.birdcamHost + '/client/videoroom', {
        what: 'unpublish',
        transaction: this.getTransaction(),
      })
      .pipe(
        tap(() => this.loggerService.log('unpublish')),
        this.queue()
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
        tap(() => this.loggerService.log('destroy')),
        this.queue()
      );
  }
}
