import { Injectable } from '@nestjs/common';
import { exhaustMap, switchMap } from 'rxjs';
import { JanusEventsService } from '../application/janus-events.service';
import { JanusAdminApiService } from '../infrastructure/janus-admin-api.service';
import { StreamingService } from './streaming.service';

@Injectable()
export class JanusEventHandlerService {
  constructor(
    private readonly janusEventsService: JanusEventsService,
    private readonly janusApiService: JanusAdminApiService,
    private readonly streamingService: StreamingService
  ) {
    this.init();
    this.startBirdcamWhenSubscriberHasJoined();
    this.stopBirdcamWhenLastScubriberHasLeft();
  }

  private startBirdcamWhenSubscriberHasJoined() {
    this.janusEventsService.userAttachedPluginStreaming
      .pipe(exhaustMap(() => this.streamingService.startBirdCam()))
      .subscribe();
  }

  private stopBirdcamWhenLastScubriberHasLeft(): void {
    this.janusEventsService.userDetachedPluginStreaming
      .pipe(
        exhaustMap(() => this.streamingService.stopBirdCamWhenNoSubscriber())
      )
      .subscribe();
  }

  private init(): void {
    this.streamingService
      .initMountpoint()
      .pipe(
        exhaustMap(() => this.janusApiService.listSessions()),
        switchMap((sessions) => {
          if (sessions.length) {
            return this.streamingService.startBirdCam();
          }
          return this.streamingService.stopBirdcam();
        })
      )
      .subscribe();
  }
}
