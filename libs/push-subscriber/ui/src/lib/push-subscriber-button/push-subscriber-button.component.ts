import { Component } from '@angular/core';
import { PushSubscriberService } from '@bird-cam/push-subscriber/application';

@Component({
  selector: 'bird-cam-push-subscriber-button',
  templateUrl: './push-subscriber-button.component.html',
})
export class PushSubscriberButtonComponent {
  constructor(readonly pushSubscriberService: PushSubscriberService) {}
  subscribe(): void {
    this.pushSubscriberService.requestSubscription();
  }

  unsubscribe(): void {
    this.pushSubscriberService.unsubscribe();
  }
}
