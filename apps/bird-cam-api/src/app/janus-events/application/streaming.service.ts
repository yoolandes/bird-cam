import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import {
  BehaviorSubject,
  Observable,
  catchError,
  delay,
  exhaustMap,
  filter,
  map,
  of,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs';
import { JanusAdminApiService } from '../infrastructure/janus-admin-api.service';
import { JanusStreamingApiService } from '../infrastructure/janus-streaming-api.service';
import { StreamingApiService } from '../infrastructure/streaming-api.service';
import { JanodeService } from './janode-api.service';

@Injectable()
export class StreamingService {
  private stoppingCam = false;

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

  startBirdCam(): Observable<void> {
    this.loggerService.info('Starting birdcam...');
    this.stoppingCam = false;
    return this.streamingApiService.start().pipe(
      tap(() => this.loggerService.info('Birdcam started!')),
      tap(() => this.birdcamIsStreaming.next(true))
    );
  }

  stopBirdcam(): Observable<void> {
    this.loggerService.info('Stopping birdcam...');
    return this.streamingApiService.stop().pipe(
      tap(() => this.loggerService.info('Birdcam stopped!')),
      tap(() => this.birdcamIsStreaming.next(false))
    );
  }

  stopBirdCamWhenNoSubscriber(): Observable<void> {
    return this.janusAdminApiService.listSessions().pipe(
      tap(() => (this.stoppingCam = true)),
      delay(5000),
      switchMap((sessions: any) => {
        if (this.stoppingCam && sessions.length === 0) {
          return this.stopBirdcam();
        } else {
          return of(void 0);
        }
      })
    );
  }
}
