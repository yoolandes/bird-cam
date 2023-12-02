import { Injectable } from '@nestjs/common';
import {
  catchError,
  exhaustMap,
  first,
  merge,
  of,
  switchMap,
  takeUntil,
  takeWhile,
  tap,
} from 'rxjs';
import { JanusEventsService } from '../application/janus-events.service';
import { JanusAdminApiService } from '../infrastructure/janus-admin-api.service';
import { StreamingService } from './streaming.service';
import { LoggerService } from '@bird-cam/logger';
import { retryBackoff } from 'backoff-rxjs';

@Injectable()
export class JanusEventHandlerService {
  endInit = merge(
    this.janusEventsService.userAttachedPluginStreaming,
    this.janusEventsService.userDetachedPluginStreaming
  ).pipe(first());

  constructor(
    private readonly janusEventsService: JanusEventsService,
    private readonly janusApiService: JanusAdminApiService,
    private readonly streamingService: StreamingService,
    private readonly loggerService: LoggerService
  ) {
    this.init();
    this.startBirdcamWhenSubscriberHasJoined();
    this.stopBirdcamWhenLastScubriberHasLeft();
  }

  private startBirdcamWhenSubscriberHasJoined() {
    this.janusEventsService.userAttachedPluginStreaming
      .pipe(
        exhaustMap(() =>
          this.streamingService.startBirdCam().pipe(
            catchError((err: Error) => {
              this.loggerService.error(
                'Can not start Birdcam as subscriber joined. Trying again...'
              );
              console.log(err.message);
              throw err;
            }),
            retryBackoff({
              initialInterval: 1000,
              maxInterval: 1000 * 30,
            }),
            takeUntil(this.janusEventsService.userDetachedPluginStreaming)
          )
        )
      )
      .subscribe({
        complete: () => this.loggerService.error('Completed! This can not be!'),
      });
  }

  private stopBirdcamWhenLastScubriberHasLeft(): void {
    this.janusEventsService.userDetachedPluginStreaming
      .pipe(
        exhaustMap(() =>
          this.streamingService.stopBirdCamWhenNoSubscriber().pipe(
            catchError((err: Error) => {
              this.loggerService.error(
                'Can not stop Birdcam as subscriber left. Tying again...'
              );
              console.log(err.message);
              throw err;
            }),
            retryBackoff({
              initialInterval: 1000,
              maxInterval: 1000 * 30,
            }),
            takeUntil(this.janusEventsService.userAttachedPluginStreaming)
          )
        )
      )
      .subscribe();
  }

  private init(): void {
    this.streamingService
      .initMountpoint()
      .pipe(
        switchMap(() =>
          this.janusApiService.listSessions().pipe(
            exhaustMap((sessions) => {
              if (sessions.length) {
                return this.streamingService.startBirdCam();
              }
              return this.streamingService.stopBirdCamWhenNoSubscriber().pipe();
            }),
            catchError((err: Error) => {
              this.loggerService.error('Can not initalize! Trying again...');
              console.log(err.message);
              throw err;
            }),
            retryBackoff({
              initialInterval: 1000,
              maxInterval: 1000 * 60 * 10,
            })
          )
        ),
        takeUntil(this.endInit)
      )
      .subscribe({
        complete: () => this.loggerService.info('Initialization done!'),
      });
  }
}
