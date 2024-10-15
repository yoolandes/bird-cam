import { Component } from '@angular/core';
import { ActiveViewersService } from '@bird-cam/active-viewers/application';
import { ModalController } from '@ionic/angular';
import { ViewerHistoryComponent } from '../viewer-history/viewer-history.component';

@Component({
  selector: 'bird-cam-active-viewers',
  templateUrl: './active-viewers.component.html',
})
export class ActiveViewersComponent {
  constructor(
    private readonly modalController: ModalController,
    readonly activeViewersService: ActiveViewersService
  ) {}

  async openDetails(): Promise<void> {
    const modal = await this.modalController.create({
      component: ViewerHistoryComponent,
      breakpoints: [0, 0.66, 1],
      initialBreakpoint: 0.66,
    });
    modal.present();
  }
}
