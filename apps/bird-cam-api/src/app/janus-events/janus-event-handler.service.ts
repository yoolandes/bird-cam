import { Injectable } from '@nestjs/common';
import { catchError, filter, of, switchMap, tap } from 'rxjs';
import { JanusApiService } from './janus-api.service';
import { JanusEventsService } from './janus-events.service';

@Injectable()
export class JanusEventHandlerService {
  private isBirdCamStreaming = false;

  constructor(
    private readonly janusEventsService: JanusEventsService,
    private readonly januApiService: JanusApiService
  ) {
    this.januApiService
      .stopBirdcam()
      .pipe(
        tap(() => console.log('Stopped Birdcam')),
        catchError((err) => {
          console.log(err);
          return of();
        })
      )
      .subscribe();

    this.janusEventsService.publisherHasJoined
      .pipe(tap(() => console.log('Started Birdcam')))
      .subscribe(() => (this.isBirdCamStreaming = true));

    this.janusEventsService.publisherHasLeft
      .pipe(tap(() => console.log('Stopped Birdcam')))
      .subscribe(() => (this.isBirdCamStreaming = false));

    this.janusEventsService.subscriberHasJoined
      .pipe(
        tap(() => console.log('Subscriber has joined')),
        filter(() => !this.isBirdCamStreaming),
        switchMap(() => this.januApiService.startBirdCam())
      )
      .subscribe();

    this.janusEventsService.subscriberHasLeft
      .pipe(
        tap(() => console.log('Subscriber has left')),
        filter(() => this.isBirdCamStreaming),
        switchMap(() => this.januApiService.listSessions()),
        filter((sessions) => sessions.length === 1),
        switchMap(() => this.januApiService.stopBirdcam())
      )
      .subscribe();
  }
}
