import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class UserSocketsService {
  private userSockets: { [userId: string]: Socket } = {};

  addUserSocket(userId: string, socket: Socket): void {
    this.userSockets[userId] = socket;
  }

  getUserSocket(userId: string): Socket | undefined {
    return this.userSockets[userId];
  }

  removeUserSocket(userId: string): void {
    this.userSockets[userId] = null;
  }

  getAllUserSockets(): { [userId: string]: Socket } {
    return this.userSockets;
  }
}
