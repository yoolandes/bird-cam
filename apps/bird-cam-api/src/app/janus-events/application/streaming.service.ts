import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import {
  BehaviorSubject,
  catchError,
  delay,
  exhaustMap,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { JanusAdminApiService } from '../infrastructure/janus-admin-api.service';
import { JanusStreamingApiService } from '../infrastructure/janus-streaming-api.service';
import { StreamingApiService } from '../infrastructure/streaming-api.service';
import { JanodeService } from './janode-api.service';
import { retryBackoff } from 'backoff-rxjs';

@Injectable()
export class StreamingService {
  private locked = false;

  private birdcamIsStreaming = new BehaviorSubject<boolean>(false);
  birdcamIsStreaming$ = this.birdcamIsStreaming.asObservable();

  constructor(
    private readonly streamingApiService: StreamingApiService,
    private readonly loggerService: LoggerService,
    private readonly janusAdminApiService: JanusAdminApiService,
    private readonly janusStreamingApiService: JanusStreamingApiService,
    private readonly janodeService: JanodeService
  ) {}

  initMountpoint(): Observable<void> {
    this.loggerService.info('Init Mountpoint...');
    return this.janodeService.attachStreamingPlugin().pipe(
      exhaustMap((sessionInfo) =>
        this.janusStreamingApiService
          .listMountpoints(sessionInfo)
          .pipe(map((mountpoints) => ({ sessionInfo, mountpoints })))
      ),
      exhaustMap(({ sessionInfo, mountpoints }) => {
        if (mountpoints.length > 0) {
          return of(void 0);
        }
        return this.janusStreamingApiService.createMountpoint(sessionInfo);
      }),
      exhaustMap(() => this.janodeService.detachStreamingPlugin()),
      map(() => void 0)
    );
  }

  startBirdCamForSnapshot(): Observable<void> {
    this.loggerService.log('Staring birdcam for snapshot...');
    if (this.birdcamIsStreaming.value) {
      this.loggerService.log('Staring birdcam for snapshot...');
      this.locked = true;
      return of(void 0);
    }
    return this.startBirdCam().pipe(tap(() => (this.locked = true)));
  }

  startBirdCam(): Observable<void> {
    this.loggerService.info('Starting birdcam...');
    return this.streamingApiService.start().pipe(
      catchError((err: Error) => {
        this.loggerService.error('Can not start Birdcam. Trying again...');
        throw err;
      }),
      retryBackoff({
        initialInterval: 1000,
        maxInterval: 1000 * 30,
      }),
      tap(() => this.loggerService.info('Birdcam started!')),
      tap(() => this.birdcamIsStreaming.next(true))
    );
  }

  private stopBirdcam(): Observable<void> {
    this.loggerService.info('Stopping birdcam...');
    return this.streamingApiService.stop().pipe(
      catchError((err: Error) => {
        this.loggerService.error('Can not stop Birdcam. Trying again...');
        throw err;
      }),
      retryBackoff({
        initialInterval: 1000,
        maxInterval: 1000 * 30,
      }),
      tap(() => this.loggerService.info('Birdcam stopped!')),
      tap(() => this.birdcamIsStreaming.next(false))
    );
  }

  stopBirdCamForSnapshot(): Observable<void> {
    this.locked = false;
    return this.stopBirdCamWhenNoSubscriber();
  }

  stopBirdCamWhenNoSubscriber(): Observable<void> {
    return this.janusAdminApiService.listSessions().pipe(
      delay(5000),
      switchMap((sessions: any) => {
        this.loggerService.log('Session count is: ' + sessions.length);
        if (!this.locked && sessions.length === 0) {
          return this.stopBirdcam();
        } else {
          return of(void 0);
        }
      })
    );
  }
}
