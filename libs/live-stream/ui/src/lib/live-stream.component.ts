import { AfterViewInit, Component } from '@angular/core';
import { LiveStreamFacade } from 'libs/live-stream/infrastructure/src/lib/+state/live-stream.facade';

@Component({
  selector: 'bird-cam-live-stream',
  templateUrl: './live-stream.component.html',
})
export class LiveStreamComponent implements AfterViewInit {

  constructor(
    readonly liveStreamFacade: LiveStreamFacade,
    ) {

  }
  ngAfterViewInit(): void {
    this.liveStreamFacade.initLiveStream();
  }

  canPlay(): void {
    // this.webrtcProgressListenerService.changeProgress(Progress.Streaming);
  }

  
}
