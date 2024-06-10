import { Component } from '@angular/core';
import { PushSubscriberService } from '@bird-cam/push-subscriber/application';
import { SwPush } from '@angular/service-worker';
import { ToastController } from '@ionic/angular';
import { TranslocoService } from '@ngneat/transloco';
import { skip } from 'rxjs';

@Component({
  selector: 'bird-cam-push-subscriber-button',
  templateUrl: './push-subscriber-button.component.html',
})
export class PushSubscriberButtonComponent {
  protected readonly Notification = Notification;

  constructor(
    readonly pushSubscriberService: PushSubscriberService,
    readonly swPush: SwPush,
    private readonly toastController: ToastController,
    private readonly translocoService: TranslocoService
  ) {
    this.extracted();
  }

  subscribe(): void {
    this.pushSubscriberService.requestSubscription();
  }

  unsubscribe(): void {
    this.pushSubscriberService.unsubscribe();
  }

  private extracted() {
    this.pushSubscriberService.showSubscription$
      .pipe(skip(1))
      .subscribe((showSubscription) => {
        const translationKey = showSubscription
          ? 'pushSubscriber.subscribed'
          : 'pushSubscriber.unsubscribed';
        this.toastController
          .create({
            message: this.translocoService.translate(translationKey),
          })
          .then((toast) => toast.present());
      });
  }
}
