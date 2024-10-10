import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'bird-cam-motion-activity-list',
  templateUrl: './motion-activity-list.component.html',
})
export class MotionActivityListComponent {
  constructor(readonly modalController: ModalController) {}
}
