import { Injectable } from '@nestjs/common';
import { Gpio } from 'onoff';
import { Subject } from 'rxjs';
import { SnapshotService } from '../snapshot/snapshot.service';

@Injectable()
export class MotionDetectorService {

  private readonly motionSensor = new Gpio(4, 'in', 'both');
  private readonly motionThreshold = 2000;

  private motionDetectorTimeout?: NodeJS.Timeout;

  private readonly motionDetected = new Subject<Blob>();
  readonly motionDetected$ = this.motionDetected.asObservable();

  constructor(private readonly snapshotService: SnapshotService) {
    this.detectMotion();
  }

  private detectMotion(): void {
    this.motionSensor.watch((_, value) => this.onMotion(value));
  }

  private onMotion(value: number) {
    if (value === 1) {
      this.snapshotService.getSnapshot().subscribe(snapshot => {
        this.motionDetectorTimeout = setTimeout(() => this.motionDetected.next(snapshot), this.motionThreshold);
      });
    } else {
      clearTimeout(this.motionDetectorTimeout);
    }

  }

}
