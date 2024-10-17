import { Component, OnInit } from '@angular/core';
import { SnapshotService } from '../../../../application/src/lib/snapshot.service';
import { IonicSlides, ModalController } from '@ionic/angular';
import { filter, map } from 'rxjs';
import { ImageModalComponent } from '../image-modal/image-modal.component';

@Component({
  selector: 'bird-cam-recent-snapshots-slider',
  templateUrl: './recent-snapshots-slider.component.html',
  styleUrls: ['./recent-snapshots-slider.component.scss'],
})
export class RecentSnapshotsSliderComponent implements OnInit {
  swiperModules = [IonicSlides];

  images$ = this.snapshotService.snapshots$.pipe(
    filter((snapshots) => !!snapshots.length),
    map((snapshots) => {
      return snapshots.map(
        (snapshot) => '/snapshot/' + snapshot.filePath.split('/').pop()
      );
    })
  );

  constructor(
    readonly snapshotService: SnapshotService,
    private readonly modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.snapshotService.loadSnapshots();
  }

  async openPreview(initialSlide: number): Promise<void> {
    await this.modalController
      .create({
        component: ImageModalComponent,
        componentProps: {
          initialSlide,
        },
      })
      .then((modal) => modal.present());
  }
}
