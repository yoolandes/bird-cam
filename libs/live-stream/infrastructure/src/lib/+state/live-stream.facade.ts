import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { LiveStreamService } from '../api/live-stream.service';


@Injectable()
export class LiveStreamFacade {

  readonly stream$ = this.liveStreamService.stream$;
  readonly liveStreamProgress$ = this.liveStreamService.progress$;

  constructor(private readonly liveStreamService: LiveStreamService) {
  }


  initLiveStream() {
    this.liveStreamService.getStream();
  }
 

}
