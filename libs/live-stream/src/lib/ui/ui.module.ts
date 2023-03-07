import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveStreamComponent } from './live-stream/live-stream.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [LiveStreamComponent],
  imports: [CommonModule, IonicModule],
  exports:  [LiveStreamComponent]
})
export class UiModule {}
