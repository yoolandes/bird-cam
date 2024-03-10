import { Component } from '@angular/core';
import { PushSubscriberService } from '@bird-cam/push-subscriber/application';
import { SwPush } from '@angular/service-worker';

@Component({
  selector: 'bird-cam-push-subscriber-button',
  templateUrl: './push-subscriber-button.component.html',
})
export class PushSubscriberButtonComponent {
  protected readonly Notification = Notification;
  constructor(
    readonly pushSubscriberService: PushSubscriberService,
    readonly swPush: SwPush
  ) {}
  subscribe(): void {
    this.pushSubscriberService.requestSubscription();
  }

  unsubscribe(): void {
    this.pushSubscriberService.unsubscribe();
  }
}
