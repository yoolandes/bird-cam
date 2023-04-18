import { Injectable } from '@nestjs/common';
import { ReplaySubject, Subject } from 'rxjs';

@Injectable()
export class BrightnessEventsService {
  private readonly brightness = new Subject<number>();
  readonly brightness$ = this.brightness.asObservable();

  publish(brightness: number): void {
    this.brightness.next(brightness);
  }
}
