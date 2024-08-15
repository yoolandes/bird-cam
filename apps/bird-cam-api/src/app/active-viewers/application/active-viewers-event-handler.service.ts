import { Injectable } from '@nestjs/common';
import { ViewActivityService } from '../view-activity.service';
import { JanusEventsService } from '../../janus-events/application/janus-events.service';

@Injectable()
export class ActiveViewersEventHandlerService {
  constructor(
    private readonly janusEventsService: JanusEventsService,
    private readonly viewActivityService: ViewActivityService
  ) {
    this.janusEventsService.userAttachedPluginStreaming.pipe().subscribe(() => {
      this.viewActivityService.create();
    });
  }
}
