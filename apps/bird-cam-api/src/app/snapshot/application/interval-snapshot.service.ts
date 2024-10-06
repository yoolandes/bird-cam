import { catchError, finalize, of, switchMap, take, tap, timer } from 'rxjs';
import { LoggerService } from '@bird-cam/logger';
import { SnapshotService } from './snapshot.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IntervalSnapshotService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly snapshotService: SnapshotService
  ) {
    timer(30 * 1000, 1000 * 60 * 7.5)
      .pipe(
        tap(() => this.loggerService.log('Take interval snapshot...')),
        switchMap(() =>
          this.snapshotService.snapshot$.pipe(
            take(1),
            tap((base64) =>
              this.snapshotService.createFromFile(base64, new Date())
            ),
            catchError((err) => {
              this.loggerService.error('Cant take Interval snapshot');
              this.loggerService.error(JSON.stringify(err));
              return of();
            }),
            finalize(() =>
              this.loggerService.error('Completed! This can not be! Interval')
            )
          )
        ),
        tap(() => this.loggerService.log('Interval Snapshot taken...')),
        finalize(() =>
          this.loggerService.error('Completed! This can not be! Interval2')
        )
      )
      .subscribe();
  }
}
