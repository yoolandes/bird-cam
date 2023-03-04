import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LiveStreamComponent } from './live-stream/live-stream.component';

@NgModule({
  declarations: [LiveStreamComponent],
  imports: [CommonModule],
  exports:  [LiveStreamComponent]
})
export class UiModule {}
