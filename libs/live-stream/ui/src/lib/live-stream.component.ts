import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { StreamProgress } from '@bird-cam/live-stream/model';
import { LiveStreamFacade } from 'libs/live-stream/infrastructure/src/lib/+state/live-stream.facade';
import { filter } from 'rxjs';

@Component({
  selector: 'bird-cam-live-stream',
  templateUrl: './live-stream.component.html',
})
export class LiveStreamComponent implements AfterViewInit {
  @ViewChild('video') video!: ElementRef;
  constructor(readonly liveStreamFacade: LiveStreamFacade) {}
  ngAfterViewInit(): void {
    this.liveStreamFacade.initLiveStream();
    this.liveStreamFacade.stream$
      .pipe(filter(({ active }) => !active))
      .subscribe(() => {
        this.video.nativeElement.load();
      });
  }

  canPlay(): void {
    this.liveStreamFacade.setProgress(StreamProgress.Streaming);
  }
}
