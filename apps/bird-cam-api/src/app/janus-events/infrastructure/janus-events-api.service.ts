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
import {
  JanusEvent,
  JanusMessage,
  Name,
  Plugin,
  StreamingStatus,
} from '../model/janus-message.model';

@Injectable()
export class JanusEventsApiService {
  readonly userHasJoined = new Observable<JanusMessage>();
  readonly userHasLeft = new Observable<JanusMessage>();

  readonly userHasPublished = new Observable<JanusMessage>();
  readonly userHasUnpublished = new Observable<JanusMessage>();

  readonly configured = new Observable<JanusMessage>();

  private readonly janusEvent = new ReplaySubject<JanusMessage>();

  readonly userStartedStream = new Observable<JanusMessage>();

  readonly userAttachedPluginStreaming = new Observable<JanusMessage>();

  constructor(private readonly loggerService: LoggerService) {
    this.userStartedStream = this.janusEvent.pipe(
      filter(
        (message) => message.event.data?.status === StreamingStatus.Starting
      ),
      share()
    );

    this.userAttachedPluginStreaming = this.janusEvent.pipe(
      filter(
        (message) =>
          message.event.name === Name.Attached &&
          message.event.plugin === Plugin.Streaming
      ),
      share()
    );
  }

  publishMessage(message: JanusMessage): void {
    if (message.type !== 32) {
      console.log(message);
    }
    this.janusEvent.next(message);
  }
}
