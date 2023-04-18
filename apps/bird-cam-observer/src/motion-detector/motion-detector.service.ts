import { Injectable } from '@nestjs/common';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { createGpio } from '../utils/gpio';

@Injectable()
export class MotionDetectorService {
  private readonly motionSensor = createGpio(4, 'in', 'both');
  private readonly motionThreshold = 8000;

  private motionDetectorTimeout?: NodeJS.Timeout;

  private readonly motionDetected = new BehaviorSubject<boolean>(false);
  readonly motionDetected$ = this.motionDetected
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor() {
    this.detectMotion();
  }

  private detectMotion(): void {
    this.motionSensor.watch((_, value) => this.onMotion(value));
  }

  private onMotion(value: number) {
    if (value === 1) {
      this.motionDetectorTimeout = setTimeout(() => {
        this.motionDetected.next(true);
      }, this.motionThreshold);
    } else {
      clearTimeout(this.motionDetectorTimeout);
      this.motionDetected.next(false);
    }
  }
}
