import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { extractAccessTokenFromCookie } from 'src/utils';
import { AuthService } from '../auth/auth.service';
import { ChatService } from './chat.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ActionChatHandlers,
  ActionRoomHandlers,
} from './handlers/handlers.map';

// @UseGuards(JwtGuard) // add jwt guard for chat auth
@WebSocketGateway({ namespace: 'chat' })
export class ChatEventsGateway {
  private userSockets: { [userId: string]: Socket } = {};
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
  ) {}

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
    this.userSockets[user.id] = client;

    console.log('socket of user assigned to const map');

    const messagesWithClientId =
      await this.chatService.fetchMessagesOnRoomForUser('general', client);
    console.log('messages :', messagesWithClientId);
    this.server.emit('load_general_chat_' + user.id, messagesWithClientId);
    console.log('load_general_chat_' + user.id, messagesWithClientId);
  }

  handleDisconnect(client: Socket): void {
    delete this.userSockets[client.data.id];
    client.off('message', () => console.log('chat !'));
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ): Promise<void> {
    console.log('client :', client);
    console.log('Received message: ', payload);
    console.log('userid ?: ', client.data, client.data.id, client.id);
    await this.chatService.sendMessage(payload, client, this.server);
  }

  @SubscribeMessage('chat-action')
  async chatAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): Promise<void> {

    
    
    
    
    ActionChatHandlers[payload.action];
  }

  @SubscribeMessage('room-action')
  async roomAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: any,
  ): Promise<void> {
    ActionRoomHandlers[payload.action];
  }
}
