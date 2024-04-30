import { Injectable } from '@nestjs/common';
import { JanusEventsService } from '../../janus-events/application/janus-events.service';
import { combineLatest, exhaustMap, tap } from 'rxjs';
import { JanusAdminApiService } from '../../janus-events/infrastructure/janus-admin-api.service';
import { ActiveViewserWsService } from '../infrastructure/active-viewers-ws.service';
import { LoggerService } from '@bird-cam/logger';

@Injectable()
export class ActiveViewersService {
  activeViewers = 0;
  constructor(
    private readonly janusEventsService: JanusEventsService,
    private readonly janusAdminApiService: JanusAdminApiService,
    private readonly activeViewserWsService: ActiveViewserWsService,
    private readonly loggerService: LoggerService
  ) {
    combineLatest([
      this.janusEventsService.userAttachedPluginStreaming,
      this.janusEventsService.userDetachedPluginStreaming,
    ])
      .pipe(
        exhaustMap(() => this.janusAdminApiService.listSessions()),
        tap((sessions) => (this.activeViewers = sessions.length)),
        tap((sessions) => this.activeViewserWsService.send(sessions.length))
      )
      .subscribe({
        complete: () =>
          this.loggerService.error(
            'Completed! This can not be! Active Viewers'
          ),
        error: (err) => this.loggerService.error(err + 'active viewers'),
      });
  }
}
