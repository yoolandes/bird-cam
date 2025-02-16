import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  path: '/api/events',
  namespace: 'events',
})
export class ActiveViewserWsService {
  readonly eventName = 'activeViewers';

  @WebSocketServer()
  server: Server;

  send(activeViewers: number): void {
    const event = {
      activeViewers,
    };
    this.server.emit(this.eventName, event);
  }
}
