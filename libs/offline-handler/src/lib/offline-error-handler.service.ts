import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { filter, ReplaySubject, retry, switchMap, tap } from 'rxjs';
import { HealthPingDataService } from './infrastructure/health-ping-data.service';
import { TranslocoService } from '@ngneat/transloco';

@Injectable({
  providedIn: 'root',
})
export class OfflineErrorHandler implements ErrorHandler {
  private cantReachServer = new ReplaySubject<boolean>(1);
  private alert: HTMLIonAlertElement | undefined;

  constructor(
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService
  ) {
    this.cantReachServer
      .pipe(filter((cantReachFilter) => cantReachFilter))
      .subscribe(() => this.presentAlert());

    this.cantReachServer
      .pipe(
        filter((cantReachFilter) => cantReachFilter),
        tap(() => console.log('cant reach filter')),
        switchMap(() =>
          injector
            .get(HealthPingDataService)
            .getHealthPing()
            .pipe(
              retry({
                delay: 5000,
                resetOnSuccess: true,
              })
            )
        ),
        tap(() => location.reload())
      )
      .subscribe();
  }

  handleError(error: Error | HttpErrorResponse): void {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 504 || error.status === 502) {
        this.cantReachServer.next(true);
      }
    }
    throw error;
  }

  async presentAlert(): Promise<void> {
    if (this.alert) {
      return;
    }
    this.alert = await this.injector.get(AlertController).create({
      header: this.translocoService.translate('offlineHandler.header'),
      message: this.translocoService.translate('offlineHandler.message'),
      backdropDismiss: false,
      translucent: false,
    });

    await this.alert.present();
  }
}
