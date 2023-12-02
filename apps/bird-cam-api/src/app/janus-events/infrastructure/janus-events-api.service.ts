import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import { filter, Observable, ReplaySubject, share } from 'rxjs';
import {
  JanusMessage,
  Name,
  Plugin,
  StreamingStatus,
} from '../model/janus-message.model';

@Injectable()
export class JanusEventsApiService {
  private readonly janusEvent = new ReplaySubject<JanusMessage>();

  readonly userStartedStream = new Observable<JanusMessage>();

  readonly userAttachedPluginStreaming = new Observable<JanusMessage>();

  readonly userDetachedPluginStreaming = new Observable<JanusMessage>();

  readonly serviceUserAttachedPluginStreaming = new Observable<JanusMessage>();

  readonly serviceUserDetachedPluginStreaming = new Observable<JanusMessage>();

  readonly bytesSent = new Observable<JanusMessage>();

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
          message.event.plugin === Plugin.Streaming &&
          message.event.opaque_id === '123'
      ),
      share()
    );

    this.serviceUserAttachedPluginStreaming = this.janusEvent.pipe(
      filter(
        (message) =>
          message.event.name === Name.Attached &&
          message.event.plugin === Plugin.Streaming &&
          message.event.opaque_id !== '123'
      ),
      share()
    );

    this.userDetachedPluginStreaming = this.janusEvent.pipe(
      filter(
        (message) =>
          message.event.name === Name.Detached &&
          message.event.plugin === Plugin.Streaming &&
          message.event.opaque_id === '123'
      ),
      share()
    );

    this.serviceUserDetachedPluginStreaming = this.janusEvent.pipe(
      filter(
        (message) =>
          message.event.name === Name.Detached &&
          message.event.plugin === Plugin.Streaming &&
          message.event.opaque_id !== '123'
      ),
      share()
    );

    this.bytesSent = this.janusEvent.pipe(
      filter((message) => message.type === 32 && message.subtype === 3),
      share()
    );
  }

  publishMessage(message: JanusMessage): void {
    this.janusEvent.next(message);
  }
}
