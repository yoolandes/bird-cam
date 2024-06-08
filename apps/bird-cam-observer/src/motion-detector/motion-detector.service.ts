import { LoggerService } from '@bird-cam/logger';
import { Injectable } from '@nestjs/common';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';
import { createGpio } from '../utils/gpio';

@Injectable()
export class MotionDetectorService {
  private readonly motionSensor = createGpio(516, 'in', 'both');

  private readonly motionDetected = new BehaviorSubject<boolean>(false);
  readonly motionDetected$ = this.motionDetected
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(private readonly loggerService: LoggerService) {
    this.detectMotion();
  }

  private detectMotion(): void {
    this.motionSensor.watch((_, value) => this.onMotion(value));
  }

  private onMotion(value: number) {
    this.loggerService.log('Detected motion with value: ' + value);
    this.motionDetected.next(value === 1);
  }
}
