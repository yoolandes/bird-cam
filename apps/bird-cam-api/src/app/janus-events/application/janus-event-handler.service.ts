import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import {
  catchError,
  delay,
  filter,
  of,
  retry,
  retryWhen,
  switchMap,
  tap,
  zip,
} from 'rxjs';
import { JanusEventsService } from '../application/janus-events.service';
import { JanusApiService } from '../infrastructure/janus-api.service';
import { StreamingService } from './streaming.service';

@Injectable()
export class JanusEventHandlerService {
  constructor(
    private readonly janusEventsService: JanusEventsService,
    private readonly loggerService: LoggerService,
    private readonly janusApiService: JanusApiService,
    private readonly streamingService: StreamingService
  ) {
    // this.init();
    // this.startBirdcamWhenSubscriberHasJoined();
    // this.stopBirdcamWhenLastScubriberHasLeft();
  }

  private createMountPointWhenUserJoined() {
    this.janusEventsService.userAttachedPluginStreaming.subscribe(() =>
      this.streamingService.createMountpoint()
    );
  }

  // private init(): void {
  //   this.loggerService.info('Init JanusEventHandlerService...');
  //   this.streamingService
  //     .getBirdCamId()
  //     .pipe(
  //       // tap((birdcamId) => this.janusEventsService.setBirdCamId(birdcamId)),
  //       switchMap(() =>
  //         zip(
  //           this.streamingService.isBirdcamStreaming(),
  //           this.janusApiService.listSessions()
  //         )
  //       ),
  //       switchMap(([isBirdCamStreaming, sessions]) => {
  //         this.loggerService.info(sessions.length + ' participicants in room.');
  //         if (isBirdCamStreaming) {
  //           return this.streamingService.stopBirdCamWhenNoSubscriber();
  //         }

  //         if (sessions.length) {
  //           return this.streamingService.startBirdCam();
  //         }

  //         return of(void 0);
  //       }),
  //       retry({ delay: 10000 })
  //     )
  //     .subscribe();
  // }

  // private startBirdcamWhenSubscriberHasJoined(): void {
  //   this.janusEventsService.userStartedStream
  //     .pipe(
  //       switchMap(() =>
  //         this.streamingService.startBirdCam().pipe(
  //           catchError((err) => {
  //             this.loggerService.error(err.message);
  //             return of();
  //           })
  //         )
  //       )
  //     )
  //     .subscribe();
  // }

  // private stopBirdcamWhenLastScubriberHasLeft(): void {
  //   this.janusEventsService.subscriberHasLeft
  //     .pipe(
  //       switchMap(() => this.streamingService.stopBirdCamWhenNoSubscriber())
  //     )
  //     .subscribe();
  // }
}
