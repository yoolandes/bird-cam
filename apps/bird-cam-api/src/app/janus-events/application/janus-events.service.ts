import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { filter, Observable, partition, tap } from 'rxjs';
import { JanusEventsApiService } from '../infrastructure/janus-events-api.service';
import { JanusMessage } from '../model/janus-message.model';

@Injectable()
export class JanusEventsService {
  readonly publisherHasJoined = new Observable<JanusMessage>();
  readonly publisherHasLeft = new Observable<JanusMessage>();

  readonly subscriberHasJoined = new Observable<JanusMessage>();
  readonly subscriberHasLeft = new Observable<JanusMessage>();

  readonly publisherHasPublished = new Observable<JanusMessage>();
  readonly publisherHasUnpublished = new Observable<JanusMessage>();

  readonly userStartedStream = new Observable<JanusMessage>();
  readonly userAttachedPluginStreaming = new Observable<JanusMessage>();

  constructor(
    private readonly loggerService: LoggerService,
    private readonly janusEventsApiService: JanusEventsApiService
  ) {
    this.userStartedStream = this.janusEventsApiService.userStartedStream;
    this.userAttachedPluginStreaming =
      this.janusEventsApiService.userAttachedPluginStreaming;
    this.subscribe();
  }

  private subscribe() {
    this.userStartedStream.subscribe(() =>
      this.loggerService.info('User started stream')
    );

    this.userAttachedPluginStreaming.subscribe(() =>
      this.loggerService.info('User attached plugin streaming')
    );
  }
}
