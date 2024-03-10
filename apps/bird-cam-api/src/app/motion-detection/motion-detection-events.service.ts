import { Injectable } from '@nestjs/common';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class MotionDetectionEventsService {
  private readonly motionDetected = new ReplaySubject<{
    motionDetected: boolean,
    snapshot?: string
  }>();
  readonly motionDetected$ = this.motionDetected.asObservable();

  setMotionDetected(motionDetected: boolean, snapshot?: string): void {
    this.motionDetected.next({motionDetected, snapshot});
  }
}
