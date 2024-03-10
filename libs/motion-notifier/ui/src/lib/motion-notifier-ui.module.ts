import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotionNotifierButtonComponent } from './motion-notifier-button/motion-notifier-button.component';
import { IonicModule } from '@ionic/angular';
import { MotionNotifierInfrastructureModule } from '@bird-cam/motion-notifier/infrastructure';

@NgModule({
  imports: [CommonModule, IonicModule, MotionNotifierInfrastructureModule],
  declarations: [MotionNotifierButtonComponent],
  exports: [MotionNotifierButtonComponent],
})
export class MotionNotifierUiModule {}
