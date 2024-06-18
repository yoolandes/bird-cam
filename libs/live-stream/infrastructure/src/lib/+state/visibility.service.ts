import { Injectable } from '@angular/core';
import { filter, fromEvent, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VisibilityService {
  visibilitychange$ = fromEvent(document, 'visibilitychange').pipe(
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  pageVisible$ = this.visibilitychange$.pipe(
    filter(() => document.visibilityState === 'visible')
  );

  pageHidden$ = this.visibilitychange$.pipe(
    filter(() => document.visibilityState === 'hidden')
  );
}
