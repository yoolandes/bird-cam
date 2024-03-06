import { Injectable } from '@nestjs/common';
import { JanusEventsService } from '../../janus-events/application/janus-events.service';
import { combineLatest, exhaustMap, switchMap, tap } from 'rxjs';
import { JanusAdminApiService } from '../../janus-events/infrastructure/janus-admin-api.service';
import { ActiveViewserWsService } from '../infrastructure/active-viewers-ws.service';

@Injectable()
export class ActiveViewersService {
  constructor(
    private readonly janusEventsService: JanusEventsService,
    private readonly janusAdminApiService: JanusAdminApiService,
    private readonly activeViewserWsService: ActiveViewserWsService
  ) {
    combineLatest([
      this.janusEventsService.userAttachedPluginStreaming,
      this.janusEventsService.userDetachedPluginStreaming,
    ])
      .pipe(
        exhaustMap(() => this.janusAdminApiService.listSessions()),
        tap((sessions) => this.activeViewserWsService.send(sessions.length))
      )
      .subscribe();
  }
}
