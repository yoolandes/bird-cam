import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PushSubscriberInfrastructureModule } from '@bird-cam/push-subscriber/infrastructure';
import { PushSubscriberButtonComponent } from './push-subscriber-button/push-subscriber-button.component';

@NgModule({
  imports: [CommonModule, IonicModule, PushSubscriberInfrastructureModule],
  declarations: [PushSubscriberButtonComponent],
  exports: [PushSubscriberButtonComponent],
})
export class PushSubscriberUiModule {}
