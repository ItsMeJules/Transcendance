import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { extractAccessTokenFromCookie } from 'src/utils';
import { AuthService } from '../auth/auth.service';

@WebSocketGateway({ namespace: 'chat' })
export class ChatEventsGateway {
  @WebSocketServer() server: Server;

  constructor(private authService: AuthService) {}

  async handleConnection(client: Socket): Promise<void> {
    console.log('> chat Connection in');
    const access_token = extractAccessTokenFromCookie(client);
    if (!access_token) {
      console.log('no access_token');
      client.disconnect();
      return;
    }
    const user = await this.authService.validateJwtToken(access_token);

    if (!user) {
      console.log('no user');
      client.disconnect();
      return;
    }
    console.log(client);
    client.data = { id: user.id };
    console.log('test:', `user_${client.data.id}`);

    this.server.emit('chat', 'Hi all!');
    this.server.emit(
      `user_${client.data.id}`,
      `Hi user number ${client.data.id}`,
    );
  }

  handleDisconnect(client: Socket): void {
    console.log('> chat Conection out');
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() client: Socket, payload): void {
    console.log('Received message: ', payload);
    this.server.emit('message', {
      message: payload.message,
      clientId: client.data.id,
    });
  }

  // @SubscribeMessage('askFriendOnlineStatus')
  // async handleAskFriendOnlineStatus(client: Socket, friendId: string): Promise<boolean> {
  //   const isOnline = await this.isFriendOnline(friendId);
  //   return isOnline;
  // }
}
