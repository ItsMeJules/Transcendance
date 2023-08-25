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
import { Payload } from '@prisma/client/runtime/library';
import { PayloadActionDto } from './dto';

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

    await client.join(user.currentRoom);
    console.log('joined room :', user.currentRoom);
    const messagesWithClientId =
      await this.chatService.fetchMessagesOnRoomForUser(client, {
        roomName: user.currentRoom,
        server: this.server,
      });
    const nameChatFetch = 'load_chat_' + user.currentRoom;
    console.log(
      'emitting to client.id :',
      client.id,
      'messages :',
      messagesWithClientId,
      nameChatFetch,
    );
    this.server.to(client.id).emit(nameChatFetch, messagesWithClientId);
    console.log(
      'End of first socket establishment function and client.id is ',
      client.id,
    );
    // console.log('load_general_chat_' + user.id, messagesWithClientId);
  }

  handleDisconnect(client: Socket): void {
    delete this.userSockets[client.data.id];
    client.off('message', () => console.log('chat !'));
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      message: string;
      roomName: string;
    },
  ): Promise<void> {
    console.log('Received payload: ', payload);
    await this.chatService.sendMessageToRoom(client, payload, this.server);
  }

  @SubscribeMessage('chat-action')
  async chatAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: PayloadActionDto,
  ): Promise<void> {
    console.log(payload);
    const updatedPayload = {
      ...payload,
      server: this.server,
    };
    await ActionChatHandlers[payload.action](
      this.chatService,
      client,
      updatedPayload,
    );
  }

  @SubscribeMessage('room-action')
  async roomAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: PayloadActionDto,
  ): Promise<void> {
    const updatedPayload = {
      ...payload,
      server: this.server,
    };
    await ActionRoomHandlers[payload.action](
      this.chatService,
      client,
      updatedPayload,
    );
  }
}
