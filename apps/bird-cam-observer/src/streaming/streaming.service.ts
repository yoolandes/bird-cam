import { Injectable } from '@nestjs/common';
import {
  BehaviorSubject,
  catchError,
  filter,
  map,
  Observable,
  of,
  skip,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class StreamingService {
  private readonly baseUrl = 'http://localhost:9997/v3/config/paths';

  private readonly isStreaming = new BehaviorSubject(false);
  readonly isStreaming$ = this.isStreaming.asObservable();

  constructor(private readonly httpService: HttpService) {}

  startStream(): Observable<void> {
    return this.isStreaming$.pipe(
      filter((isStreaming) => !isStreaming),
      switchMap(() => {
        return this.httpService.post<void>(`${this.baseUrl}/add/cam`, {
          source: 'rpiCamera',
          runOnReady:
            'gst-launch-1.0 rtspclientsink name=s location=rtsp://localhost:$RTSP_PORT/cam_with_audio rtspsrc location=rtsp://127.0.0.1:$RTSP_PORT/$MTX_PATH latency=0 ! rtph264depay ! s. alsasrc ! queue ! audioconvert ! opusenc ! s.sink_1',
        });
      }),
      switchMap(() =>
        this.isStreaming$.pipe(
          skip(1),
          filter((isStreaming) => isStreaming),
          take(1)
        )
      ),
      map(() => void 0),
      catchError((err) => {
        if (err.error === 'path already exists') {
          return of(void 0);
        } else {
          return of(err);
        }
      })
    );
  }

  stopStream(): Observable<void> {
    return this.isStreaming$.pipe(
      filter((isStreaming) => isStreaming),
      switchMap(() =>
        this.httpService.delete<void>(`${this.baseUrl}/delete/cam`)
      ),
      switchMap(() =>
        this.isStreaming$.pipe(
          skip(1),
          filter((isStreaming) => !isStreaming),
          take(1)
        )
      ),
      map(() => void 0),
      catchError((err) => {
        if (err.error === 'path not found') {
          return of(void 0);
        } else {
          return of(err);
        }
      }),
      tap(() => this.setStreaming(false))
    );
  }

  setStreaming(isStreaming: boolean): void {
    this.isStreaming.next(isStreaming);
  }
}
