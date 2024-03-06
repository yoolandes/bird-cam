import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveViewersComponent } from './active-viewers/active-viewers.component';
import { IonicModule } from '@ionic/angular';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { provideTranslocoScope } from '@ngneat/transloco';

@NgModule({
  imports: [CommonModule, IonicModule, TranslocoModule],
  declarations: [ActiveViewersComponent],
  exports: [ActiveViewersComponent],
  providers: [provideTranslocoScope('active-viewers')],
})
export class ActiveViewersUiModule {}
