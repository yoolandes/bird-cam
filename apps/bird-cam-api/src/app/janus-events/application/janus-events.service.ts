import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JanusEventsApiService } from '../infrastructure/janus-events-api.service';
import { JanusMessage } from '../model/janus-message.model';

@Injectable()
export class JanusEventsService {
  readonly userStartedStream = new Observable<JanusMessage>();

  readonly userAttachedPluginStreaming = new Observable<JanusMessage>();

  readonly userDetachedPluginStreaming = new Observable<JanusMessage>();

  readonly serviceUserAttachedPluginStreaming = new Observable<JanusMessage>();

  readonly serviceUserDetachedPluginStreaming = new Observable<JanusMessage>();

  constructor(
    private readonly loggerService: LoggerService,
    private readonly janusEventsApiService: JanusEventsApiService
  ) {
    this.userStartedStream = this.janusEventsApiService.userStartedStream;

    this.userAttachedPluginStreaming =
      this.janusEventsApiService.userAttachedPluginStreaming;

    this.userDetachedPluginStreaming =
      this.janusEventsApiService.userDetachedPluginStreaming;

    this.serviceUserAttachedPluginStreaming =
      this.janusEventsApiService.serviceUserAttachedPluginStreaming;

    this.serviceUserDetachedPluginStreaming =
      this.janusEventsApiService.serviceUserDetachedPluginStreaming;

    this.subscribe();
  }

  private subscribe() {
    this.userStartedStream.subscribe(() =>
      this.loggerService.info('User started stream')
    );

    this.userAttachedPluginStreaming.subscribe((res) => {
      this.loggerService.info('User attached plugin streaming');
    });

    this.userDetachedPluginStreaming.subscribe((res) => {
      this.loggerService.info('User detached plugin streaming');
    });

    this.serviceUserAttachedPluginStreaming.subscribe((res) => {
      this.loggerService.info('Service user attached plugin streaming');
    });

    this.serviceUserDetachedPluginStreaming.subscribe((res) => {
      this.loggerService.info('Service user detached plugin streaming');
    });
  }
}
