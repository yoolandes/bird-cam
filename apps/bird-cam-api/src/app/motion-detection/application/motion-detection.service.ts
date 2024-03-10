import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import {
  catchError,
  exhaustMap,
  filter,
  of,
  takeWhile,
  tap,
  withLatestFrom,
} from 'rxjs';
import { SnapshotService } from '../../snapshot/application/snapshot.service';
import { MotionDetectionEventsService } from '../motion-detection-events.service';

@Injectable()
export class MotionDetectionService {
  constructor(
    private readonly motionDetectionEventsService: MotionDetectionEventsService,
    private readonly snapshotService: SnapshotService,
    private readonly loggerService: LoggerService,
    private readonly snapshotRepoService: SnapshotService
  ) {
    this.motionDetectionEventsService.motionDetected$
      .pipe(
        tap(({motionDetected}) =>
          this.loggerService.info('Motion detected ' + motionDetected)
        ),
        filter(({motionDetected}) => motionDetected),
        exhaustMap(({snapshot}) => {
          return (snapshot ? of(snapshot) : this.snapshotService.captureSnapshot()).pipe(
            catchError((err) => {
              this.loggerService.info('Cant start recording');
              this.loggerService.error(err.message);
              return of();
            }),
            tap((base64: string) =>
              this.snapshotRepoService.createFromFile(base64, new Date())
            ),
            withLatestFrom(this.motionDetectionEventsService.motionDetected$),
            takeWhile(([, {motionDetected}]) => motionDetected)
          );
        })
      )
      .subscribe();
  }
}
