import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  MessageBody,
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
    console.log('> chat connection in');
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
    client.data = { id: user.id };
    console.log('test:', `user_${client.data.id}`);

    this.server.emit('message', {
      message: 'Hi everyone!!',
      clientId: 0,
    });
    this.server.emit(
      `user_${client.data.id}`,
      `Hi user number ${client.data.id}`,
    );
  }

  handleDisconnect(client: Socket): void {
    console.log('> chat deConection ');
    client.off('message', () => console.log('chat!!!!'));
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ): void {
    // console.log('Received message: lol', client.data);
    console.log('Received message: ', payload);
    this.server.emit('message', {
      message: payload,
      clientId: client.id,
    });
  }
}
