import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './websocket.service';
import { extractAccessTokenFromCookie } from 'src/utils';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({ namespace: 'general' })
export class SocketEvents {
  @WebSocketServer()
  server: Server;

  constructor(
    private socketService: SocketService,
    private authService: AuthService,
  ) {}

  async handleConnection(client: Socket) {
    console.log('> general Connection in');
    const access_token = extractAccessTokenFromCookie(client);
    if (!access_token) {
      client.disconnect();
      return;
    }
    const user = await this.authService.validateJwtToken(access_token);
    if (!user) {
      client.disconnect();
      return;
    }
    client.data = { id: user.id };
    client.join(`user_${user.id}`);
    client.join('general_online');

    this.server.emit('general_online', 'Hi all!');
    this.server.emit(`user_${client.data.id}`, `Hi user number ${client.data.id}`);
    // console.log('test:', `user_${client.data.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log('> general Conection out');
    const socketId = client.handshake.query.userId;
    // console.log("users:", this.connectedUsers);
  }

  @SubscribeMessage('message') // This decorator listens for messages with the event name 'message'
  handleMessage(client: any, payload: any) {
    console.log('Received message:', payload);
    this.server.emit('test', 'Message received by server');
  }

  // @SubscribeMessage('askFriendOnlineStatus')
  // async handleAskFriendOnlineStatus(client: Socket, friendId: string): Promise<boolean> {
  //   const isOnline = await this.isFriendOnline(friendId);
  //   return isOnline;
  // }
}
