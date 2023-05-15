import { Injectable } from '@nestjs/common';
import { delay, filter, switchMap, tap } from 'rxjs';
import { JanusEventsService } from '../../janus-events/application/janus-events.service';
import { Uv4lApiService } from '../../janus-events/infrastructure/uv4l-api.service';
import { BrightnessEventsService } from '../brightness-events.service';
import { LedApiService } from '../infrastructure/led-api.service';
import { RecorderService } from '../../recorder/application/recorder.service';

@Injectable()
export class BrightnessEventHandlerService {
  constructor(
    private readonly janusEventsService: JanusEventsService,
    private readonly recorderService: RecorderService,
    private readonly brightnessEventsService: BrightnessEventsService,
    private readonly ledApiService: LedApiService
  ) {
    this.janusEventsService.publisherHasPublished
      .pipe(
        switchMap(() => this.recorderService.startRecording()),
        tap(() => console.log('set brightness recording true')),
        delay(3000),
        switchMap((uuid) => this.recorderService.stopRecording(uuid)),
        tap(() => console.log('set brightness recording false'))
      )
      .subscribe();

    this.brightnessEventsService.brightness$
      .pipe(
        tap(console.log),
        filter((brightness) => brightness < 0.3),
        switchMap(() => this.ledApiService.switchOn()),
        tap(() => console.log('switched light on'))
      )
      .subscribe();

    this.janusEventsService.publisherHasLeft
      .pipe(
        switchMap(() => this.ledApiService.switchOff()),
        tap(() => console.log('switched light off'))
      )
      .subscribe();
  }
}
