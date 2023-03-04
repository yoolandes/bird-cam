import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export enum Progress {
  Idle,
  PluginAttached,
  JoinedRoom,
  GotFeed,
  AttachedToFeed,
  ConnectionIsUp,
  Streaming
}

@Injectable({
  providedIn: 'root'
})
export class WebrtcProgressListenerService {

  private readonly progress = new BehaviorSubject(Progress.Idle);
  readonly progress$ = this.progress.asObservable();

  changeProgress(progress: Progress): void {
    this.progress.next(progress);
  }
}
