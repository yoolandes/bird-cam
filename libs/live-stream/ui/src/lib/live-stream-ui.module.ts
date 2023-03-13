import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveStreamComponent } from './live-stream.component';
import { LiveStreamInfrastructureModule } from 'libs/live-stream/infrastructure/src';
import { LiveStreamProgressBarComponent } from './live-stream-progress-bar/live-stream-progress-bar.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [LiveStreamComponent, LiveStreamProgressBarComponent],
  imports: [CommonModule, IonicModule, LiveStreamInfrastructureModule],
  exports: [LiveStreamComponent, LiveStreamProgressBarComponent],
})
export class LiveStreamUiModule {}
