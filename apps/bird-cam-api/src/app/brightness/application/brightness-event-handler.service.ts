import { Injectable } from '@nestjs/common';
import { delay, filter, switchMap, tap } from 'rxjs';
import { JanusEventsService } from '../../janus-events/application/janus-events.service';
import { RecorderService } from '../../recorder/application/recorder.service';
import { BrightnessEventsService } from '../brightness-events.service';
import { LedApiService } from '../infrastructure/led-api.service';
import { LoggerService } from '@bird-cam/logger';

@Injectable()
export class BrightnessEventHandlerService {
  constructor(
    private readonly janusEventsService: JanusEventsService,
    private readonly recorderService: RecorderService,
    private readonly brightnessEventsService: BrightnessEventsService,
    private readonly ledApiService: LedApiService,
    private readonly loggerService: LoggerService
  ) {
    this.janusEventsService.publisherHasPublished
      .pipe(
        switchMap(() => this.recorderService.startRecording()),
        tap(() => this.loggerService.log('set brightness recording true')),
        delay(3000),
        switchMap((uuid) => this.recorderService.stopRecording(uuid)),
        tap(() => this.loggerService.log('set brightness recording false'))
      )
      .subscribe();

    this.brightnessEventsService.brightness$
      .pipe(
        tap((brightness) => this.loggerService.log(brightness + '')),
        filter((brightness) => brightness < 0.3),
        switchMap(() => this.ledApiService.switchOn()),
        tap(() => this.loggerService.log('switched light on'))
      )
      .subscribe();

    this.janusEventsService.publisherHasLeft
      .pipe(
        switchMap(() => this.ledApiService.switchOff()),
        tap(() => this.loggerService.log('switched light off'))
      )
      .subscribe();
  }
}
