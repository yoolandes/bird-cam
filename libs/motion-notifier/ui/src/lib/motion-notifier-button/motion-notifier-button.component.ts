import { Component } from '@angular/core';
import { PushSubscriberService } from '@bird-cam/motion-notifier/application';

@Component({
  selector: 'bird-cam-motion-notifier-button',
  templateUrl: './motion-notifier-button.component.html',
})
export class MotionNotifierButtonComponent {
  constructor(readonly pushSubscriberService: PushSubscriberService) {}
  subscribe(): void {
    this.pushSubscriberService.requestSubscription();
  }

  unsubscribe(): void {
    this.pushSubscriberService.unsubscribe();
  }
}
