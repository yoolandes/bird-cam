import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveViewersComponent } from './active-viewers/active-viewers.component';
import { IonicModule } from '@ionic/angular';
import { provideTranslocoScope, TranslocoModule } from '@ngneat/transloco';
import { ViewerHistoryComponent } from './viewer-history/viewer-history.component';
import { BaseChartDirective } from 'ng2-charts';
import { ActiveViewersInfrastructureModule } from '../../../infrastructure/src/lib/active-viewers-infrastructure.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    TranslocoModule,
    BaseChartDirective,
    ActiveViewersInfrastructureModule,
  ],
  declarations: [ActiveViewersComponent, ViewerHistoryComponent],
  exports: [ActiveViewersComponent, ViewerHistoryComponent],
  providers: [provideTranslocoScope('active-viewers')],
})
export class ActiveViewersUiModule {}
