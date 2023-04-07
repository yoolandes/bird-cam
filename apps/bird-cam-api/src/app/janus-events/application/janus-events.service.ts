import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, partition, ReplaySubject, tap } from 'rxjs';
import { JanusEventsApiService } from '../infrastructure/janus-events-api.service';
import { JanusMessage } from '../model/janus-message.model';
import { Uv4lApiService } from '../infrastructure/uv4l-api.service';

@Injectable()
export class JanusEventsService {
  readonly publisherHasJoined = new Observable<JanusMessage>();
  readonly publisherHasLeft = new Observable<JanusMessage>();

  readonly subscriberHasJoined = new Observable<JanusMessage>();
  readonly subscriberHasLeft = new Observable<JanusMessage>();

  private readonly janusUsername: string;
  private birdCamId: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly loggerService: LoggerService,
    private readonly janusEventsApiService: JanusEventsApiService,
    private readonly uv4lApiService: Uv4lApiService
  ) {
    this.janusUsername =
      this.configService.getOrThrow<string>('JANUS_USERNAME');

    this.uv4lApiService
      .getBirdCamId(this.janusUsername)
      .subscribe((sessionId) => (this.birdCamId = sessionId));

    let publisherHasJoined: Observable<JanusMessage>;

    [publisherHasJoined, this.subscriberHasJoined] = partition(
      this.janusEventsApiService.userHasJoined,
      (message) => message.event.data?.display === this.janusUsername
    );

    this.publisherHasJoined = publisherHasJoined.pipe(
      tap((message) => (this.birdCamId = message.event.data.id)),
      tap(() => loggerService.warn(this.birdCamId + ''))
    );

    [this.publisherHasLeft, this.subscriberHasLeft] = partition(
      this.janusEventsApiService.userHasLeft,
      (message) => {
        return this.birdCamId && message.event.data?.id === this.birdCamId;
      }
    );

    this.subscribe();
  }

  private subscribe() {
    this.publisherHasJoined.subscribe(() =>
      this.loggerService.info('Publisher has joined')
    );

    this.publisherHasLeft.subscribe(() =>
      this.loggerService.warn('Publisher has left')
    );
    this.subscriberHasJoined.subscribe(() =>
      this.loggerService.warn('Subscriber has joined')
    );

    this.subscriberHasLeft.subscribe(() =>
      this.loggerService.warn('Subscriber has left')
    );
  }
}
