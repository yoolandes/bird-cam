import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfflineErrorHandler } from './offline-error-handler.service';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslocoPipe } from '@ngneat/transloco';

@NgModule({
  imports: [CommonModule, RouterModule, IonicModule, TranslocoPipe],
  providers: [
    {
      provide: ErrorHandler,
      useClass: OfflineErrorHandler,
    },
  ],
})
export class OfflineHandlerModule {}
