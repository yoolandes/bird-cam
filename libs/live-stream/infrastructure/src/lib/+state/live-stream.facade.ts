import { Injectable } from '@angular/core';
import { StreamProgress } from '@bird-cam/live-stream/model';
import { LiveStreamService } from '../api/streaming.service';

@Injectable()
export class LiveStreamFacade {
  readonly stream$ = this.liveStreamService.stream$;
  readonly liveStreamProgress$ = this.liveStreamService.progress$;

  constructor(private readonly liveStreamService: LiveStreamService) {}

  initLiveStream() {
    this.liveStreamService.getStream();
  }

  setProgress(streamProgress: StreamProgress): void {
    this.liveStreamService.progress.next(streamProgress);
  }
}
