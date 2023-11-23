import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import {
  catchError,
  distinctUntilChanged,
  filter,
  of,
  switchMap,
  tap,
  throttleTime,
} from 'rxjs';
import { StreamingService } from '../../janus-events/application/streaming.service';
import { SnapshotService } from '../../snapshot/application/snapshot.service';
import { MotionDetectionEventsService } from '../motion-detection-events.service';

@Injectable()
export class MotionDetectionService {
  constructor(
    private readonly motionDetectionService: MotionDetectionEventsService,
    private readonly streamingService: StreamingService,
    private readonly snapshotService: SnapshotService,
    private readonly loggerService: LoggerService,
    private readonly snapshotRepoService: SnapshotService
  ) {
    const motionDetectedDebounced$ =
      this.motionDetectionService.motionDetected$.pipe(
        throttleTime(10000, undefined, { leading: true, trailing: true }),
        distinctUntilChanged()
      );

    motionDetectedDebounced$
      .pipe(
        tap((motionDetected) =>
          this.loggerService.info('Motion detected ' + motionDetected)
        ),
        filter((motionDetected) => motionDetected),
        switchMap(() => {
          return this.snapshotService.captureSnapshot().pipe(
            catchError((err) => {
              this.loggerService.info('Cant start recording');
              this.loggerService.error(err.message);
              return of();
            })
          );
        }),
        tap((buffer: Uint8Array) =>
          this.snapshotRepoService.createFromFile(buffer, new Date())
        )
      )
      .subscribe();
  }
}
