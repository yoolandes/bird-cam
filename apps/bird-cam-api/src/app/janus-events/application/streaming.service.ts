import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import {
  Observable,
  catchError,
  delay,
  filter,
  first,
  map,
  of,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs';
import { JanusApiService } from '../infrastructure/janus-api.service';
import { Uv4lApiService } from '../infrastructure/uv4l-api.service';
import { JanusEventsService } from './janus-events.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StreamingService {
  private readonly janusUsername: string;
  private stoppingCam = false;

  constructor(
    private readonly janusEventsService: JanusEventsService,
    private readonly uv4lApiService: Uv4lApiService,
    private readonly loggerService: LoggerService,
    private readonly janusApiService: JanusApiService,
    private readonly configService: ConfigService
  ) {
    this.janusUsername =
      this.configService.getOrThrow<string>('JANUS_USERNAME');
  }

  startBirdCam(): Observable<any> {
    this.loggerService.info('Starting birdcam...');
    this.stoppingCam = false;

    return this.uv4lApiService.getPath().pipe(
      switchMap((sessionInfo) =>
        sessionInfo.sessionId
          ? of(sessionInfo)
          : this.uv4lApiService.createSession()
      ),
      switchMap(({ handle, sessionId }) =>
        this.janusApiService.handleInfo(sessionId, handle)
      ),
      map((data) => this.isBirdCamStreamingInternal(data.info)),
      catchError((err) => {
        this.loggerService.error(err);
        return this.uv4lApiService.destroy().pipe(map(() => false));
      }),
      switchMap((isBirdCamStreaming) =>
        isBirdCamStreaming
          ? of(void 0)
          : this.uv4lApiService.join().pipe(
              switchMap(() => this.janusEventsService.publisherHasJoined),
              first(),
              switchMap(() => this.uv4lApiService.publish()),
              switchMap(() =>
                this.janusEventsService.publisherHasPublished.pipe(first())
              )
            )
      )
    );
  }

  stopBirdcam(): Observable<any> {
    this.loggerService.info('Stopping birdcam...');
    return this.uv4lApiService.unpublish().pipe(
      switchMap(() =>
        this.janusEventsService.publisherHasUnpublished.pipe(first())
      ),
      switchMap(() => this.uv4lApiService.destroy())
    );
  }

  stopBirdCamWhenNoSubscriber(): Observable<any> {
    return this.janusApiService.listSessions().pipe(
      catchError((err) => {
        this.loggerService.error(err.message);
        return of([]);
      }),
      filter((sessions: any) => sessions.length === 1),
      tap(() => (this.stoppingCam = true)),
      delay(10000),
      takeWhile(() => this.stoppingCam),
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

  getBirdCamId(): Observable<number> {
    return this.uv4lApiService.getPath().pipe(
      switchMap(({ sessionId, handle }) =>
        sessionId
          ? this.janusApiService
              .listParticipants(`${sessionId}/${handle}`)
              .pipe(
                catchError((err) => {
                  this.loggerService.error(err);
                  return this.uv4lApiService.destroy().pipe(map(() => []));
                }),
                map(
                  (participants) =>
                    participants.find(
                      (participant) =>
                        participant.display === this.janusUsername
                    )?.id || ''
                )
              )
          : of('')
      )
    );
  }

  private isBirdCamStreamingInternal(handleInfo: any): boolean {
    return handleInfo?.plugin_specific?.streams?.length;
  }

  isBirdcamStreaming(): Observable<boolean> {
    return this.uv4lApiService.getPath().pipe(
      switchMap(({ handle, sessionId }) => {
        return sessionId
          ? this.janusApiService.handleInfo(sessionId, handle)
          : of({});
      }),
      map((data) => this.isBirdCamStreamingInternal(data.info))
    );
  }
}
