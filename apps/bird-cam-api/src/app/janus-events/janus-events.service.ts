import { Injectable } from '@nestjs/common';
import { filter, map, Observable, Subject, tap } from 'rxjs';
import { JanusEvent, JanusMessage } from './dto/janus-message.dto';

@Injectable()
export class JanusEventsService {
  readonly userHasJoined = new Observable<JanusMessage>();
  readonly userHasLeft = new Observable<JanusMessage>();

  readonly publisherHasJoined = new Observable<JanusMessage>();
  readonly publisherHasLeft = new Observable<JanusMessage>();

  readonly subscriberHasJoined = new Observable<JanusMessage>();
  readonly subscriberHasLeft = new Observable<JanusMessage>();

  private readonly janusEvent = new Subject<JanusMessage>();

  private readonly birdCamDisplayName = 'nk';
  private birdCamId: number;

  constructor() {
    this.userHasJoined = this.janusEvent.pipe(
      filter((message) => message.event.data?.event === JanusEvent.Joined)
    );

    this.userHasLeft = this.janusEvent.pipe(
      filter((message) => message.event.data?.event === JanusEvent.Leaving)
    );

    this.publisherHasJoined = this.userHasJoined.pipe(
      filter(
        (message) => message.event.data?.display === this.birdCamDisplayName
      ),
      tap((message) => (this.birdCamId = message.event.data.id))
    );

    this.publisherHasLeft = this.userHasLeft.pipe(
      filter((message) => message.event.data?.id === this.birdCamId),
      tap(() => (this.birdCamId = undefined))
    );

    this.subscriberHasJoined = this.userHasJoined.pipe(
      filter(
        (message) => message.event.data?.display !== this.birdCamDisplayName
      ),
      tap((message) => (this.birdCamId = message.event.data.id))
    );

    this.subscriberHasLeft = this.userHasLeft.pipe(
      filter((message) => message.event.data?.id !== this.birdCamId),
      tap(() => (this.birdCamId = undefined))
    );
  }

  publishMessage(message: JanusMessage): void {
    this.janusEvent.next(message);
  }

}
