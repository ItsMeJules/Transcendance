import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private connectedSockets: Map<string, Socket> = new Map();

  addSocket(socketId: string, socket: Socket) {
    this.connectedSockets.set(socketId, socket);
  }

  removeSocket(socketId: string) {
    this.connectedSockets.delete(socketId);
  }

  getSocket(socketId: string): Socket | undefined {
    return this.connectedSockets.get(socketId);
  }

  getAllSockets(): Socket[] {
    return Array.from(this.connectedSockets.values());
  }

  closeAllSockets() {
    for (const socket of this.connectedSockets.values()) {
      socket.disconnect();
    }
    this.connectedSockets.clear();
  }
}
