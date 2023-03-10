import { AfterViewInit, Component } from '@angular/core';
import { LiveStreamService } from '../../infrastructure/live-stream.service';
import { Progress, WebrtcProgressListenerService } from '../../infrastructure/webrtc-progress-listener.service';

@Component({
  selector: 'bird-cam-live-stream',
  templateUrl: './live-stream.component.html',
})
export class LiveStreamComponent implements AfterViewInit {

  progressBarValue = 0;

  constructor(
    readonly liveStreamService: LiveStreamService,
    readonly webrtcProgressListenerService: WebrtcProgressListenerService,
    ) {

  }
  ngAfterViewInit(): void {
    // this.liveStreamService.init();
    this.webrtcProgressListenerService.progress$.subscribe(progress => {
      const max = Object.keys(Progress).length / 2 - 1;
      this.progressBarValue = (1 / max * progress);
    });
  }

  canPlay(): void {
    this.webrtcProgressListenerService.changeProgress(Progress.Streaming);
  }

  
}
