import { Component } from '@angular/core';
import { LiveStreamService } from '../../infrastructure/live-stream.service';

@Component({
  selector: 'bird-cam-live-stream',
  templateUrl: './live-stream.component.html',
  styleUrls: ['./live-stream.component.scss'],
})
export class LiveStreamComponent {

  constructor(readonly liveStreamService: LiveStreamService) {

  }
}
