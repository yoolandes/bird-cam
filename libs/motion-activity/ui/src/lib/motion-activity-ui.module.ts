import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MotionActivityComponent } from './motion-activity/motion-activity.component';
import { BaseChartDirective } from 'ng2-charts';
import { IonicModule } from '@ionic/angular';
import { MotionActivityInfrastructureModule } from '@bird-cam/motion-activity/infrastructure';
import { provideTranslocoScope, TranslocoPipe } from '@ngneat/transloco';
import { MotionActivityListComponent } from './motion-activity-list/motion-activity-list.component';
import { SnapshotUiModule } from '@bird-cam/snapshot/ui';

@NgModule({
  imports: [
    CommonModule,
    BaseChartDirective,
    IonicModule,
    MotionActivityInfrastructureModule,
    TranslocoPipe,
    SnapshotUiModule,
  ],
  declarations: [MotionActivityComponent, MotionActivityListComponent],
  exports: [MotionActivityComponent],
  providers: [provideTranslocoScope('motion-activity'), DatePipe],
})
export class MotionActivityUiModule {}
