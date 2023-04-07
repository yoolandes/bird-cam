import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import { filter, Observable, ReplaySubject, share, tap } from 'rxjs';
import { JanusEvent, JanusMessage } from '../model/janus-message.model';

@Injectable()
export class JanusEventsApiService {
  readonly userHasJoined = new Observable<JanusMessage>();
  readonly userHasLeft = new Observable<JanusMessage>();

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
  }

  publishMessage(message: JanusMessage): void {
    this.janusEvent.next(message);
  }
}
