import { LoggerService } from '@bird-cam/logger';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { catchError, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { JanusApiService } from './janus-api.service';

@Injectable()
export class Uv4lApiService {
  private readonly birdcamHost: string;
  private readonly janusGateway: string;
  private readonly janusUsername: string;
  private readonly janusRoom: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    private readonly janusApiService: JanusApiService
  ) {
    this.birdcamHost =
      this.configService.getOrThrow<string>('BIRDCAM_HOST') + '/api/janus';
    this.janusGateway = this.configService.getOrThrow<string>('JANUS_GATEWAY');
    this.janusUsername =
      this.configService.getOrThrow<string>('JANUS_USERNAME');
    this.janusRoom = this.configService.getOrThrow<string>('JANUS_ROOM');
  }

  getBirdCamId(janusUsername: string): Observable<number> {
    return this.putGateway().pipe(
      switchMap(() => this.httpService.get(this.birdcamHost + '/client')),
      switchMap(({ data }) =>
        data.session_id
          ? this.janusApiService
              .listParticipants(`${data.session_id}/${data.plugins[0].id}`)
              .pipe(
                map(
                  (participants) =>
                    participants.find(
                      (participant) => participant.display === janusUsername
                    )?.id || ''
                )
              )
          : of('')
      )
    );
  }

  getBirdcamSessionId(): Observable<any> {
    return this.putGateway().pipe(
      switchMap(() => this.httpService.get(this.birdcamHost + '/client')),
      map(({ data }) => data.session_id)
    );
  }

  startBirdCam(): Observable<boolean> {
    this.loggerService.info('Starting birdcam...');
    return this.putGateway().pipe(
      switchMap(() => this.httpService.get(this.birdcamHost + '/client')),
      switchMap(({ data }) =>
        data.session_id ? of({ data }) : this.createSession()
      ),
      switchMap(({ data }) =>
        this.janusApiService.handleInfo(data.session_id, data.plugins[0].id)
      ),
      map((data) => this.isBirdCamStreaming(data.info)),
      switchMap((isBirdCamStreaming) =>
        isBirdCamStreaming ? of(true) : this.publish()
      )
    );
  }

  stopBirdcam(): Observable<any> {
    this.loggerService.info('Stopping birdcam...');
    return this.httpService.post(this.birdcamHost + '/client', {
      what: 'destroy',
      plugin: 'videoroom',
      transaction: this.getTransaction(),
    });
  }

  stopBirdCamWhenNoSubscriber(): Observable<any> {
    return this.janusApiService.listSessions().pipe(
      catchError((err) => {
        this.loggerService.error(err.message);
        return of([]);
      }),
      filter((sessions: any) => sessions.length === 1),
      switchMap(() =>
        this.stopBirdcam().pipe(
          catchError((err) => {
            this.loggerService.error(err.message);
            return of();
          })
        )
      )
    );
  }

  setRecording(record: boolean): Observable<any> {
    return this.httpService.post(this.birdcamHost + '/client/videoroom', {
      what: 'configure',
      transaction: this.getTransaction(),
      body: {
        record,
        rec_filename: 'recording',
      },
    });
  }

  isBirdcamRecording(): Observable<boolean> {
    return this.httpService.get(this.birdcamHost + '/client').pipe(
      switchMap(({ data }) => {
        return data.session_id
          ? this.janusApiService.handleInfo(data.session_id, data.plugins[0].id)
          : of({});
      }),
      map((data) => this.isBirdCamRecording(data.info))
    );
  }

  private isBirdCamStreaming(handleInfo: any): boolean {
    return handleInfo?.plugin_specific?.streams?.length;
  }

  private isBirdCamRecording(handleInfo: any): boolean {
    return !!handleInfo?.plugin_specific?.streams[0]?.recording;
  }

  private createSession(): Observable<any> {
    return this.httpService.post(this.birdcamHost + '/client', {
      what: 'create',
      plugin: 'videoroom',
      transaction: this.getTransaction(),
    });
  }

  private getTransaction(): string {
    return crypto.randomUUID();
  }

  private putGateway(): Observable<any> {
    return this.httpService.get(this.birdcamHost + '/client/settings').pipe(
      switchMap(({ data }: any) =>
        this.httpService.put(this.birdcamHost + '/client/settings', {
          ...data,
          gateway: {
            ...data.gateway,
            url: this.janusGateway,
          },
        })
      )
    );
  }

  private publish(): Observable<boolean> {
    return this.httpService
      .post(this.birdcamHost + '/client/videoroom', {
        what: 'join',
        transaction: this.getTransaction(),
        body: {
          room: this.janusRoom,
          username: this.janusUsername,
        },
      })
      .pipe(
        switchMap(() =>
          this.httpService.post(this.birdcamHost + '/client/videoroom', {
            what: 'publish',
            transaction: this.getTransaction(),
            body: {
              audio: false,
              video: true,
              data: false,
              adjust_max_bitrate_for_hardware_videocodec: true,
              max_bitrate_bits: 0,
              use_hardware_videocodec: true,
              video_format_id: 95,
              record: false,
            },
          })
        ),
        map(() => false)
      );
  }
}
