import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { Observable, map, of, switchMap, tap } from 'rxjs';
import { Uv4lApiService } from '../../janus-events/infrastructure/uv4l-api.service';

@Injectable()
export class RecorderService {
  private readonly recordingQueue = new Set<string>();

  constructor(private readonly uv4lApiService: Uv4lApiService) {}

  startRecording(): Observable<string> {
    return this.uv4lApiService.isBirdcamRecording().pipe(
      switchMap((isBirdcamRecording) =>
        isBirdcamRecording ? of(void 0) : this.uv4lApiService.setRecording(true)
      ),
      map(() => crypto.randomUUID()),
      tap((uuid) => this.recordingQueue.add(uuid))
    );
  }

  stopRecording(uuid: string): Observable<void> {
    return this.uv4lApiService.isBirdcamRecording().pipe(
      tap(() => this.recordingQueue.delete(uuid)),
      switchMap((isBirdcamRecording) =>
        isBirdcamRecording && !this.recordingQueue.size
          ? this.uv4lApiService.setRecording(false)
          : void 0
      ),
      map(() => void 0)
    );
  }
}
