import { catchError, finalize, of, switchMap, take, tap, timer } from 'rxjs';
import { LoggerService } from '@bird-cam/logger';
import { SnapshotService } from './snapshot.service';
import { Injectable } from '@nestjs/common';
import { SnapshotCause } from '@bird-cam/snapshot/model';
import { LessThan } from 'typeorm';
import * as schedule from 'node-schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class IntervalSnapshotService {
  readonly deleteOldIntervalImagesSchedule: string;
  constructor(
    private readonly loggerService: LoggerService,
    private readonly snapshotService: SnapshotService,
    private readonly configService: ConfigService
  ) {
    this.deleteOldIntervalImagesSchedule =
      this.configService.getOrThrow<string>(
        'DELETE_OLD_INTERVAL_IMAGES_SCHEDULE'
      );
    this.takeIntervalSnapshots();
    this.scheduleDeleteOldIntervalImages(this.deleteOldIntervalImagesSchedule);
  }

  private takeIntervalSnapshots() {
    timer(30 * 1000, 1000 * 60 * 7.5)
      .pipe(
        tap(() => this.loggerService.log('Take interval snapshot...')),
        switchMap(() =>
          this.snapshotService.snapshot$.pipe(
            take(1),
            tap((base64) =>
              this.snapshotService.createFromFile(
                base64,
                new Date(),
                SnapshotCause.Interval
              )
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

  private scheduleDeleteOldIntervalImages(cronSpec: string): void {
    const job = schedule.scheduleJob(cronSpec, async () => {
      await this.deleteOldIntervalImages();
    });

    if (job) {
      this.loggerService.log(
        'Next delete-old-images job will run on: ' + job.nextInvocation()
      );
    } else {
      this.loggerService.error(
        'Delete-old-images job will not run with "DELETE_OLD_INTERVAL_IMAGES_SCHEDULE"=' +
          cronSpec +
          '. Please provide a valid cron specification.'
      );
    }
  }

  private async deleteOldIntervalImages(): Promise<void> {
    this.loggerService.log('Deleting old interval images...');
    const oneWeekAgo = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
    const oldImages = await this.snapshotService.find({
      where: {
        snapshotCause: (SnapshotCause.Interval + '') as any,
        date: LessThan(oneWeekAgo),
      },
      select: ['id'],
    });

    let deletedImages = 0;

    await Promise.all(
      oldImages.map((image) => {
        this.snapshotService.remove(image.id);
        deletedImages++;
      })
    );
    this.loggerService.log(deletedImages + ' images have been deleted!');
  }
}
