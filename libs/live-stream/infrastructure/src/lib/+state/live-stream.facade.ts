import { Injectable } from '@angular/core';
import { StreamProgress } from '@bird-cam/live-stream/model';
import { LiveStreamService } from '../api/streaming.service';
import { take } from 'rxjs';
import { VisibilityService } from './visibility.service';

@Injectable()
export class LiveStreamFacade {
  readonly stream$ = this.liveStreamService.stream$;
  readonly liveStreamProgress$ = this.liveStreamService.progress$;

  constructor(
    private readonly liveStreamService: LiveStreamService,
    private readonly visibilityService: VisibilityService
  ) {}

  startStream(): void {
    this.liveStreamService.startStream();
    this.visibilityService.pageHidden$.pipe(take(1)).subscribe(() => {
      this.stopStream();
      this.visibilityService.pageVisible$
        .pipe(take(1))
        .subscribe(() => this.startStream());
    });
  }

  stopStream(): void {
    this.liveStreamService.stopStream();
  }

  setProgress(streamProgress: StreamProgress): void {
    this.liveStreamService.progress.next(streamProgress);
  }
}
