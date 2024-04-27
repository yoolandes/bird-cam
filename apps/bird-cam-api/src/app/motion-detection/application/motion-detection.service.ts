import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import {
  catchError,
  debounce,
  exhaustMap,
  filter,
  interval,
  map,
  Observable,
  of,
  pairwise,
  take,
  tap,
} from 'rxjs';
import { SnapshotService } from '../../snapshot/application/snapshot.service';
import { MotionDetectionEventsService } from '../motion-detection-events.service';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';

@Injectable()
export class MotionDetectionService {
  private debounceTime = 1000;
  private readonly maxDebounceTime = 2 * 60 * 1000;

  readonly motionDetected$: Observable<void>;

  constructor(
    private readonly motionDetectionEventsService: MotionDetectionEventsService,
    private readonly snapshotService: SnapshotService,
    private readonly loggerService: LoggerService
  ) {
    this.motionDetected$ =
      this.motionDetectionEventsService.motionDetected$.pipe(
        tap(({ motionDetected }) =>
          this.loggerService.info('Motion detected ' + motionDetected)
        ),
        filter(({ motionDetected }) => motionDetected),
        tap(
          () =>
            (this.debounceTime = Math.min(
              this.debounceTime * 2,
              this.maxDebounceTime
            ))
        ),
        tap(() =>
          this.loggerService.log(
            'Current motion detect debounce time is ' + this.debounceTime
          )
        ),
        debounce(() => interval(this.debounceTime)),
        exhaustMap(() => {
          return this.snapshotService.snapshot$.pipe(
            catchError((err) => {
              this.loggerService.error('Cant start recording');
              this.loggerService.error(err.message);
              return of();
            }),
            pairwise(),
            take(1),
            exhaustMap(([file1, file2]) => {
              const input1 = Buffer.from(file1, 'base64');
              const input2 = Buffer.from(file2, 'base64');
              return Promise.all([
                sharp(input1).ensureAlpha().raw().toBuffer(),
                sharp(input2).ensureAlpha().raw().toBuffer(),
              ]).then(([imageData1, imageData2]) => {
                const pixelArray1 = new Uint8Array(imageData1.buffer);
                const pixelArray2 = new Uint8Array(imageData2.buffer);

                return pixelmatch(pixelArray1, pixelArray2, null, 640, 480, {
                  threshold: 0.2,
                });
              });
            }),
            tap(() => (this.debounceTime = 1000)),
            filter((pixelmatch) => pixelmatch > 5000)
          );
        }),
        map(() => void 0)
      );

    this.motionDetected$
      .pipe(
        tap(() => this.loggerService.log('Real motion detected')),
        exhaustMap(() =>
          this.snapshotService.snapshot$.pipe(
            tap((base64: string) => {
              this.loggerService.log('Create Snapshot from file');
              this.snapshotService.createFromFile(base64, new Date());
            }),
            take(1),
            catchError((err) => {
              this.loggerService.error('Cant start recording');
              this.loggerService.error(err.message);
              return of();
            })
          )
        )
      )
      .subscribe();
  }
}
