import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { MotionActivityFacadeService } from '@bird-cam/motion-activity/infrastructure';
import { map, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { MotionActivityListComponent } from '../motion-activity-list/motion-activity-list.component';

@Component({
  selector: 'bird-cam-motion-activity',
  templateUrl: './motion-activity.component.html',
})
export class MotionActivityComponent implements OnInit {
  constructor(
    private readonly motionActivityFacadeService: MotionActivityFacadeService,
    private readonly modalController: ModalController
  ) {}
  ngOnInit(): void {
    this.motionActivityFacadeService.getMotionActivity();
  }

  async openDetails(): Promise<void> {
    const modal = await this.modalController.create({
      component: MotionActivityListComponent,
      breakpoints: [0, 0.66, 1],
      initialBreakpoint: 0.66,
    });
    modal.present();
  }
}
