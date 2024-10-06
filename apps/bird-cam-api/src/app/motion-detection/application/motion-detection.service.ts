import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import {
  catchError,
  exhaustMap,
  filter,
  finalize,
  map,
  Observable,
  of,
  pairwise,
  skip,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { SnapshotService } from '../../snapshot/application/snapshot.service';
import { MotionDetectionEventsService } from '../motion-detection-events.service';
import sharp from 'sharp';
import pixelmatch from 'pixelmatch';

@Injectable()
export class MotionDetectionService {
  private iterator = 2;
  private readonly maxDebounceTime = 2 * 60 * 1000;
  private timeoutId: any;

  readonly motionDetected$: Observable<void>;
  readonly realMotionDetected$: Observable<void>;

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
        tap(() => {
          clearTimeout(this.timeoutId);

          let currentDebounceTime = Math.min(
            Math.pow(++this.iterator, 2) * 1000,
            this.maxDebounceTime
          );

          this.loggerService.log('currentDebounceTime: ' + currentDebounceTime);

          this.timeoutId = setTimeout(() => {
            this.iterator = 2;
            this.loggerService.log('reset iterator to: ' + this.iterator);
          }, currentDebounceTime);
        }),
        tap(() => this.loggerService.log('set iterator to: ' + this.iterator)),
        filter(() => this.iterator <= 3),
        map(() => void 0)
      );

    this.realMotionDetected$ = this.motionDetected$.pipe(
      switchMap(() => {
        return this.snapshotService.snapshot$.pipe(
          catchError((err) => {
            this.loggerService.error('Cant start recording');
            this.loggerService.error(err.message);
            return of();
          }),
          tap(() => this.loggerService.log('got file')),
          skip(1),
          pairwise(),
          take(1),
          tap(() => this.loggerService.log('Comparing two images...')),
          exhaustMap(([file1, file2]) => {
            const input1 = Buffer.from(file1, 'base64');
            const input2 = Buffer.from(file2, 'base64');
            return Promise.all([
              sharp(input1).ensureAlpha().raw().toBuffer(),
              sharp(input2).ensureAlpha().raw().toBuffer(),
            ])
              .then(([imageData1, imageData2]) => {
                const pixelArray1 = new Uint8Array(imageData1.buffer);
                const pixelArray2 = new Uint8Array(imageData2.buffer);

                return pixelmatch(pixelArray1, pixelArray2, null, 1920, 1080, {
                  threshold: 0.2,
                });
              })
              .catch((err) => {
                this.loggerService.error('Can not calc Pixel match');
                this.loggerService.error(err);
                return 0;
              });
          }),
          tap((pixelmatch) =>
            this.loggerService.log('Pixelmatch: ' + pixelmatch)
          ),
          catchError((e) => {
            this.loggerService.error('Error while calculating pixelmatch');
            this.loggerService.error(JSON.stringify(e));
            return of(0);
          }),
          filter((pixelmatch) => pixelmatch > 5000)
        );
      }),
      map(() => void 0),
      finalize(() =>
        this.loggerService.log('Completed! This can not be! motionDetected$')
      )
    );

    this.motionDetected$
      .pipe(
        tap(() => this.loggerService.log('Motion detected')),
        exhaustMap(() =>
          this.snapshotService.snapshot$.pipe(
            tap((base64: string) => {
              this.loggerService.log('Created Snapshot from file!');
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
