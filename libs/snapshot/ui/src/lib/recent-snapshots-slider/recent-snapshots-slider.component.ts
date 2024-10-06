import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SnapshotService } from '../../../../application/src/lib/snapshot.service';
import { IonicSlides } from '@ionic/angular';
import { filter, map, tap } from 'rxjs';
import { SwiperContainer } from 'swiper/swiper-element';

@Component({
  selector: 'bird-cam-recent-snapshots-slider',
  templateUrl: './recent-snapshots-slider.component.html',
  styleUrls: ['./recent-snapshots-slider.component.scss'],
})
export class RecentSnapshotsSliderComponent implements OnInit {
  @ViewChild('swiperContainer') video!: ElementRef;

  swiperModules = [IonicSlides];

  images$ = this.snapshotService.snapshots$.pipe(
    filter((snapshots) => !!snapshots.length),
    map((snapshots) => {
      return snapshots.map(
        (snapshot) => '/snapshot/' + snapshot.filePath.split('/').pop()
      );
    }),
    map((paths) => {
      paths.unshift(paths[0]);
      return paths;
    }),
    tap(
      () =>
        ((this.video.nativeElement as SwiperContainer).swiper.activeIndex = 1)
    )
  );
  constructor(readonly snapshotService: SnapshotService) {}

  ngOnInit(): void {
    this.snapshotService.loadSnapshots();
  }
}
