import { Component, OnInit } from '@angular/core';
import { SnapshotService } from '../../../../application/src/lib/snapshot.service';
import { IonicSlides } from '@ionic/angular';
import { filter, map } from 'rxjs';

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

  constructor(readonly snapshotService: SnapshotService) {}

  ngOnInit(): void {
    this.snapshotService.loadSnapshots();
  }
}
