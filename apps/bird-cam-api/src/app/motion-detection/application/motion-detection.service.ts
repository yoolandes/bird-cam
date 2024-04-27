import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import {
  catchError,
  debounceTime,
  exhaustMap,
  filter,
  of,
  pairwise,
  takeWhile,
  tap,
  withLatestFrom,
} from 'rxjs';
import { SnapshotService } from '../../snapshot/application/snapshot.service';
import { MotionDetectionEventsService } from '../motion-detection-events.service';
import sharp from 'sharp';
// import pixelmatch from 'pixelmatch';

@Injectable()
export class MotionDetectionService {
  private imageCount = 0;

  constructor(
    private readonly motionDetectionEventsService: MotionDetectionEventsService,
    private readonly snapshotService: SnapshotService,
    private readonly loggerService: LoggerService
  ) {
    // this.motionDetectionEventsService.motionDetected$
    //   .pipe(
    //     tap(({ motionDetected }) =>
    //       this.loggerService.info('Motion detected ' + motionDetected)
    //     ),
    //     filter(({ motionDetected }) => motionDetected),
    //     debounceTime(60000),
    //     exhaustMap(() => {
    //       this.imageCount = 0;
    //       return this.snapshotService.captureSnapshot().pipe(
    //         tap((base64: string) => {
    //           this.imageCount++;
    //           this.snapshotService.createFromFile(base64, new Date());
    //         }),
    //         catchError((err) => {
    //           this.loggerService.error('Cant start recording');
    //           this.loggerService.error(err.message);
    //           return of();
    //         }),
    //         pairwise(),
    //         exhaustMap(([file1, file2]) => {
    //           const input1 = Buffer.from(file1, 'base64');
    //           const input2 = Buffer.from(file2, 'base64');
    //           return Promise.all([
    //             sharp(input1).ensureAlpha().raw().toBuffer(),
    //             sharp(input2).ensureAlpha().raw().toBuffer(),
    //           ]).then(([imageData1, imageData2]) => {
    //             const pixelArray1 = new Uint8Array(imageData1.buffer);
    //             const pixelArray2 = new Uint8Array(imageData2.buffer);
    //
    //             return pixelmatch(pixelArray1, pixelArray2, null, 640, 480, {
    //               threshold: 0.2,
    //             });
    //           });
    //         }),
    //         withLatestFrom(this.motionDetectionEventsService.motionDetected$),
    //         takeWhile(
    //           ([, { motionDetected }]) => motionDetected || this.imageCount < 3
    //         )
    //       );
    //     })
    //   )
    //   .subscribe({
    //     complete: () =>
    //       this.loggerService.error(
    //         'Completed! This can not be! motionDetectionEventsService'
    //       ),
    //     error: (err) => this.loggerService.error(err),
    //   });
  }
}
