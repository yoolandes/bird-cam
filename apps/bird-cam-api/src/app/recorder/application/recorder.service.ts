import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { Uv4lApiService } from '../../janus-events/infrastructure/uv4l-api.service';
import { JanusApiService } from '../../janus-events/infrastructure/janus-api.service';

@Injectable()
export class RecorderService {
  private readonly recordingQueue = new Set<string>();

  constructor(
    private readonly uv4lApiService: Uv4lApiService,
    private readonly janusApiService: JanusApiService
  ) {}

  startRecording(): Observable<string> {
    return this.isBirdcamRecording().pipe(
      switchMap((isBirdcamRecording) =>
        isBirdcamRecording
          ? of(void 0)
          : this.uv4lApiService
              .getPath()
              .pipe(
                switchMap(({ sessionId, handle }) =>
                  this.janusApiService.setRecording(sessionId, handle, true)
                )
              )
      ),
      map(() => crypto.randomUUID()),
      tap((uuid) => this.recordingQueue.add(uuid))
    );
  }

  stopRecording(uuid: string): Observable<void> {
    return this.isBirdcamRecording().pipe(
      tap(() => this.recordingQueue.delete(uuid)),
      switchMap((isBirdcamRecording) =>
        isBirdcamRecording && !this.recordingQueue.size
          ? this.uv4lApiService
              .getPath()
              .pipe(
                switchMap(({ sessionId, handle }) =>
                  this.janusApiService.setRecording(sessionId, handle, false)
                )
              )
          : of(void 0)
      ),
      map(() => void 0)
    );
  }

  private isBirdcamRecording(): Observable<boolean> {
    return this.uv4lApiService.getPath().pipe(
      switchMap(({ handle, sessionId }) => {
        return sessionId
          ? this.janusApiService.handleInfo(sessionId, handle)
          : of({});
      }),
      map((data) => this.isBirdCamRecording(data.info))
    );
  }

  private isBirdCamRecording(handleInfo: any): boolean {
    return !!handleInfo?.plugin_specific?.streams[0]?.recording;
  }
}
