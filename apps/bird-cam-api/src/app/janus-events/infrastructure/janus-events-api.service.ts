import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import {
  debounceTime,
  filter,
  Observable,
  ReplaySubject,
  share,
  tap,
} from 'rxjs';
import { JanusEvent, JanusMessage } from '../model/janus-message.model';

@Injectable()
export class JanusEventsApiService {
  readonly userHasJoined = new Observable<JanusMessage>();
  readonly userHasLeft = new Observable<JanusMessage>();

  readonly userHasPublished = new Observable<JanusMessage>();
  readonly userHasUnpublished = new Observable<JanusMessage>();

  readonly configured = new Observable<JanusMessage>();

  private readonly janusEvent = new ReplaySubject<JanusMessage>();

  constructor(private readonly loggerService: LoggerService) {
    this.userHasJoined = this.janusEvent.pipe(
      filter((message) => message.event.data?.event === JanusEvent.Joined),
      tap(() => this.loggerService.info('User has joined')),
      share()
    );

    this.userHasLeft = this.janusEvent.pipe(
      filter((message) => message.event.data?.event === JanusEvent.Leaving),
      tap(() => this.loggerService.info('User has left')),
      share()
    );

    this.userHasPublished = this.janusEvent.pipe(
      filter((message) => message.event.data?.event === JanusEvent.Published),
      debounceTime(500),
      tap(() => this.loggerService.info('User has published')),
      share()
    );

    this.userHasUnpublished = this.janusEvent.pipe(
      filter((message) => message.event.data?.event === JanusEvent.Unpublished),
      debounceTime(500),
      tap(() => this.loggerService.info('User has unpublished')),
      share()
    );

    this.configured = this.janusEvent.pipe(
      filter((message) => message.event.data?.event === JanusEvent.Configured),
      tap(() => this.loggerService.info('Room was configured')),
      share()
    );
  }

  publishMessage(message: JanusMessage): void {
    if (message.type !== 32) {
      // console.log(message);
    }
    this.janusEvent.next(message);
  }
}
