import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import { Observable, catchError, filter, of, switchMap, tap, zip } from 'rxjs';
import { JanusEventsService } from '../application/janus-events.service';
import { JanusApiService } from '../infrastructure/janus-api.service';
import { Uv4lApiService } from '../infrastructure/uv4l-api.service';

@Injectable()
export class JanusEventHandlerService {
  constructor(
    private readonly janusEventsService: JanusEventsService,
    private readonly uv4lApiService: Uv4lApiService,
    private readonly loggerService: LoggerService,
    private readonly janusApiService: JanusApiService
  ) {
    this.init();

    this.startBirdcamWhenSubscriberHasJoined();

    this.stopBirdcamWhenLastScubriberHasLeft();
  }

  private init(): void {
    this.loggerService.info('Init JanusEventHandlerService...');
    this.janusApiService
      .listSessions()
      .pipe(
        filter((sessions) => !!sessions.length),
        tap((sessions) =>
          this.loggerService.info(sessions.length + ' participicants in room.')
        ),
        switchMap((sessions) =>
          zip(this.uv4lApiService.getBirdcamSessionId(), of(sessions))
        ),
        switchMap(([birdcamSessionId, sessions]) => {
          if (sessions.includes(birdcamSessionId) && sessions.length === 1) {
            this.loggerService.info('Stopping birdcam...');
            return this.uv4lApiService.stopBirdcam();
          } else {
            return this.uv4lApiService.startBirdCam();
          }
        }),
        catchError((err) => {
          this.loggerService.error(err.message);
          return of();
        })
      )
      .subscribe();
  }

  private startBirdcamWhenSubscriberHasJoined(): void {
    this.janusEventsService.subscriberHasJoined
      .pipe(
        switchMap(() =>
          this.uv4lApiService.startBirdCam().pipe(
            catchError((err) => {
              this.loggerService.error(err.message);
              return of();
            })
          )
        )
      )
      .subscribe();
  }

  private stopBirdcamWhenLastScubriberHasLeft(): void {
    this.janusEventsService.subscriberHasLeft
      .pipe(
        switchMap(() =>
          this.janusApiService.listSessions().pipe(
            catchError((err) => {
              this.loggerService.error(err.message);
              return of([]);
            })
          )
        ),
        filter((sessions: any) => sessions.length === 1),
        switchMap(() =>
          this.uv4lApiService.stopBirdcam().pipe(
            catchError((err) => {
              this.loggerService.error(err.message);
              return of();
            })
          )
        )
      )
      .subscribe();
  }
}
