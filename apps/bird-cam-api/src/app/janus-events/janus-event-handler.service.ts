import { Injectable } from '@nestjs/common';
import { catchError, filter, forkJoin, of, switchMap, tap } from 'rxjs';
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
      .listSessions()
      .pipe(
        switchMap((sessions) =>
          forkJoin(
            sessions.map((session) => this.januApiService.listHandles(session))
          )
        ),
        switchMap((handles) => {
          return this.januApiService.listParticipants(
            `${handles[0].session_id}/${handles[0].handles[0]}`
          );
        }),
        switchMap((participants) => {
          console.log(participants);
          const isBirdcamThere = participants.some(
            (participant) =>
              participant.display === 'nk' && participant.publisher
          );
          console.log(isBirdcamThere);

          if (
            !participants.length ||
            (participants.length > 1 && isBirdcamThere)
          ) {
            console.log("dont do anything");
            return of(void 0);
          }

          if (participants.length === 1 && isBirdcamThere) {
            console.log("stop");
            return this.januApiService.stopBirdcam();
          } else {
            console.log("start");
            return this.januApiService.startBirdCam();
          }
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
        switchMap(() => this.januApiService.startBirdCam()),
        catchError((err) => {
          console.log(err);
          return of();
        })
      )
      .subscribe();

    this.janusEventsService.subscriberHasLeft
      .pipe(
        tap(() => console.log('Subscriber has left')),
        filter(() => this.isBirdCamStreaming),
        switchMap(() => this.januApiService.listSessions()),
        filter((sessions: any) => sessions.length === 1),
        switchMap(() => this.januApiService.stopBirdcam())
      )
      .subscribe();
  }
}
