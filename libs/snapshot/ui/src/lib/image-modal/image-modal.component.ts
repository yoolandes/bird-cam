import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { filter, map } from 'rxjs';
import { SnapshotService } from '../../../../application/src/lib/snapshot.service';
import { IonicSlides, ModalController } from '@ionic/angular';
import { SwiperContainer } from 'swiper/swiper-element';

@Component({
  selector: 'bird-cam-image-modal',
  templateUrl: './image-modal.component.html',
})
export class ImageModalComponent implements AfterViewInit {
  @ViewChild('swiperContainer') video!: ElementRef;
  @Input() initialSlide?: number;

  swiperModules = [IonicSlides];

  images$ = this.snapshotService.snapshots$.pipe(
    filter((snapshots) => !!snapshots.length),
    map((snapshots) => {
      return snapshots.map(
        (snapshot) => '/snapshot/' + snapshot.filePath.split('/').pop()
      );
    })
  );

  ngAfterViewInit(): void {
    (this.video.nativeElement as SwiperContainer).swiper.activeIndex =
      this.initialSlide || 0;
  }

  constructor(
    readonly snapshotService: SnapshotService,
    readonly modalController: ModalController
  ) {}
}
