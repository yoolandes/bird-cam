import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RecentSnapshotsSliderComponent } from './recent-snapshots-slider/recent-snapshots-slider.component';
import { register } from 'swiper/element/bundle';
import { SnapshotInfrastructureModule } from '@bird-cam/snapshot/infrastructure';
import { SnapshotApplicationModule } from '@bird-cam/snapshot/application';
import { BaseChartDirective } from 'ng2-charts';
import { IonicModule } from '@ionic/angular';
import { TranslocoPipe } from '@ngneat/transloco';
import { ImageModalComponent } from './image-modal/image-modal.component';

register();

@NgModule({
  imports: [
    CommonModule,
    SnapshotInfrastructureModule,
    SnapshotApplicationModule,
    BaseChartDirective,
    IonicModule,
    TranslocoPipe,
    NgOptimizedImage,
  ],
  declarations: [RecentSnapshotsSliderComponent, ImageModalComponent],
  exports: [RecentSnapshotsSliderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SnapshotUiModule {}
