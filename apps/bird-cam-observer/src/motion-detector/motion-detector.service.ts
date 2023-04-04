import { Injectable } from '@nestjs/common';
import { Direction, Edge, Gpio } from 'onoff';
import { catchError, filter, of, Subject } from 'rxjs';
import { Stream } from 'stream';
import { LoggerService } from '@bird-cam/logger';
import { SnapshotService } from '../snapshot/snapshot.service';
import { createGpio } from '../utils/gpio';

@Injectable()
export class MotionDetectorService {
  private readonly motionSensor = createGpio(4, 'in', 'both');
  private readonly motionThreshold = 8000;

  private motionDetectorTimeout?: NodeJS.Timeout;

  private readonly motionDetected = new Subject<Stream>();
  readonly motionDetected$ = this.motionDetected.asObservable();

  constructor(
    private readonly snapshotService: SnapshotService,
    private readonly loggerService: LoggerService
  ) {
    this.detectMotion();
  }

  private detectMotion(): void {
    this.motionSensor.watch((_, value) => this.onMotion(value));
  }

  private onMotion(value: number) {
    if (value === 1) {
      this.snapshotService
        .getSnapshot()
        .pipe(
          catchError((err) => {
            this.loggerService.error(err.message);
            return of();
          }),
          filter((snapshot) => !!snapshot)
        )
        .subscribe((snapshot) => {
          this.motionDetectorTimeout = setTimeout(
            () => this.motionDetected.next(snapshot),
            this.motionThreshold
          );
        });
    } else {
      clearTimeout(this.motionDetectorTimeout);
    }
  }
}
