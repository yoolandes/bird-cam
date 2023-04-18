import { Injectable } from '@nestjs/common';
import { delay, filter, switchMap, tap } from 'rxjs';
import { JanusEventsApiService } from '../../janus-events/infrastructure/janus-events-api.service';
import { Uv4lApiService } from '../../janus-events/infrastructure/uv4l-api.service';
import { BrightnessEventsService } from '../brightness-events.service';
import { LedApiService } from '../infrastructure/led-api.service';
import { JanusEventsService } from '../../janus-events/application/janus-events.service';

@Injectable()
export class BrightnessEventHandlerService {
  constructor(
    private readonly janusEventsService: JanusEventsService,
    private readonly uv4lApiService: Uv4lApiService,
    private readonly brightnessEventsService: BrightnessEventsService,
    private readonly ledApiService: LedApiService
  ) {
    this.janusEventsService.publisherHasPublished
      .pipe(
        switchMap(() => this.uv4lApiService.setRecording(true, 'brightness')),
        tap(() => console.log('set brightness recording true')),
        delay(2000),
        switchMap(() => this.uv4lApiService.setRecording(false, 'brightness')),
        tap(() => console.log('set brightness recording false')),
        switchMap(() => this.brightnessEventsService.brightness$),
        tap(console.log),
        filter((brightness) => brightness < 0.3),
        switchMap(() => this.ledApiService.switchOn()),
        tap(() => console.log('switched light on'))
      )
      .subscribe(console.warn);

    this.janusEventsService.publisherHasLeft
      .pipe(
        switchMap(() => this.ledApiService.switchOff()),
        tap(() => console.log('switched light off'))
      )
      .subscribe();
  }
}
