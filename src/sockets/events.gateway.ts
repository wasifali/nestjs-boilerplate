import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway()
export class EventsGateway {
  @WebSocketServer()
  private server: Server;
  private connectedUsers = {};
  private connectedSockets = {};

  async handleConnection(client): Promise<boolean> {
    try {
      client.emit('connected', 'connected');
    } catch (e) {
      client.emit('unauthorized', e);
    }
    return true;
  }

  emitToUsersList(payload: any, list: string[], event: string): number {
    let receivers: string[] = [];
    list.forEach(user => {
      if (this.connectedUsers[user]) {
        receivers = receivers.concat(this.connectedUsers[user]);
      }
    });
    if (receivers.length) {
      receivers.forEach(socket => {
        this.server.to(socket).emit(event, payload);
      });
    }

    return 1;
  }

  async handleDisconnect(client): Promise<boolean> {
    const userId = this.connectedSockets[client.id];
    delete this.connectedSockets[client.id];
    this.connectedUsers[userId].pop(client.id);
    if (this.connectedUsers[userId].length < 1) {
      delete this.connectedUsers[userId];
    }
    return true;
  }

  @SubscribeMessage('authorize')
  auth(client, payload): boolean {
    console.log(payload);
    try {
      const clients = this.server.sockets.clients(() => {
        console.log(123);
      });
      return true;
    } catch (e) {
      console.log(e);
    }
    return true;
  }

  @SubscribeMessage('mirror')
  mirror(client, payload): boolean {
    client.emit('mirror', payload);
    return true;
  }

  @SubscribeMessage('connectedUser')
  handleMessage(client, payload): boolean {
    this.connectedUsers[payload] = client;
    this.connectedSockets[client.id].userId = payload;
    return true;
  }
}
