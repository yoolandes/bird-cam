import { Injectable } from '@nestjs/common';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class MotionDetectionEventsService {
  private readonly motionDetected = new ReplaySubject<boolean>();
  readonly motionDetected$ = this.motionDetected.asObservable();

  setMotionDetected(motionDetected: boolean): void {
    this.motionDetected.next(motionDetected);
  }
}
