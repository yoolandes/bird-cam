import { Component } from '@angular/core';
import { LiveStreamFacade } from 'libs/live-stream/infrastructure/src';
import { StreamProgress } from 'libs/live-stream/model/src';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'bird-cam-live-stream-progress-bar',
  templateUrl: './live-stream-progress-bar.component.html',
})
export class LiveStreamProgressBarComponent {
  readonly progress$: Observable<number>;

  readonly streamProgress = StreamProgress;

  constructor(readonly liveStreamFacade: LiveStreamFacade) {
    this.progress$ = this.liveStreamFacade.liveStreamProgress$.pipe(
      map(this.normalize)
    );
  }

  private normalize(progress: StreamProgress): number {
    const max = Object.keys(StreamProgress).length / 2 - 1;
    return (1 / max) * progress;
  }
}
