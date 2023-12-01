import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Janode from 'janode';
import StreamingPlugin from 'janode/src/plugins/streaming-plugin';
import { Observable, first, from, map, of, tap } from 'rxjs';
import { SessionInfo } from '../infrastructure/streaming-api.service';

@Injectable()
export class JanodeService {
  private readonly janusWsUrl: string;

  private handle: any;

  constructor(private readonly configService: ConfigService) {
    this.janusWsUrl = this.configService.getOrThrow('JANUS_WS_URL');
  }

  attachStreamingPlugin(): Observable<SessionInfo> {
    if (this.handle) {
      return of({
        sessionId: this.handle.session.id,
        handle: this.handle.id,
      });
    }

    return from(
      Janode.connect({
        is_admin: false,
        address: {
          url: this.janusWsUrl,
        },
      })
        .then((connection) => connection.create())

        .then((session) => session.attach(StreamingPlugin))
    ).pipe(
      tap((handle: any) => (this.handle = handle)),
      map((handle: any) => ({
        sessionId: handle.session.id,
        handle: handle.id,
      })),
      first()
    );
  }

  detachStreamingPlugin(): Observable<void> {
    if (!this.handle) {
      return of(void 0);
    }
    return from(this.handle.session.destroy()).pipe(
      first(),
      map(() => void 0),
      tap(() => (this.handle = undefined))
    );
  }
}
