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
import { User } from '@prisma/client';

export enum ChatSocketEventType {
  JOIN_ROOM = "join-room",
  MESSAGE = "message",
  CHAT_ACTION = "chat-action",
  ROOM_ACTION = "room-action",
}

// @UseGuards(JwtGuard) // add jwt guard for chat auth
@WebSocketGateway({ namespace: 'chat' })
export class ChatEventsGateway {
  private userSockets: { [userId: string]: Socket } = {};
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
  ) { }

  private async setupConnection(client: Socket): Promise<User | null> {
    console.log('> chat connection in');

    const access_token = extractAccessTokenFromCookie(client);
    if (!access_token) {
      client.disconnect();
      return Promise.reject('no access_token');
    }

    const user = await this.authService.validateJwtToken(access_token);
    if (!user) {
      client.disconnect();
      return Promise.reject('no user');
    }

    client.data = { id: user.id };
    this.userSockets[user.id] = client;
    console.log('socket of user assigned to const map');

    return user;
  }

  async handleConnection(client: Socket): Promise<void> {
    const user = this.setupConnection(client)

    user
      .then(async user => {
        await client.join(user.currentRoom);

        const dto = { roomName: user.currentRoom, server: this.server }
        const messagesWithClientId = await this.chatService.fetchMessagesOnRoomForUser(client, dto);

        const payload = { currentRoom: user.currentRoom, messages: messagesWithClientId }
        this.server.to(client.id).emit(ChatSocketEventType.JOIN_ROOM, payload);

        console.log("Emitting to client: ", client.id, "\n\tpayload: ", payload)
      })
      .catch(reason => console.log(reason))
  }

  handleDisconnect(client: Socket): void {
    delete this.userSockets[client.data.id];
    client.off(ChatSocketEventType.MESSAGE, () => console.log('chat !'));
    client.off(ChatSocketEventType.CHAT_ACTION, () => console.log('chat action !'));
    client.off(ChatSocketEventType.ROOM_ACTION, () => console.log('room action !'));
  }

  @SubscribeMessage(ChatSocketEventType.MESSAGE)
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

  @SubscribeMessage(ChatSocketEventType.CHAT_ACTION)
  async chatAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: PayloadActionDto,
  ): Promise<void> {
    console.log(payload);

    const updatedPayload = { ...payload, server: this.server };
    await ActionChatHandlers[payload.action](this.chatService, client, updatedPayload);
  }

  @SubscribeMessage(ChatSocketEventType.ROOM_ACTION)
  async roomAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: PayloadActionDto,
  ): Promise<void> {
    const updatedPayload = { ...payload, server: this.server };
    await ActionRoomHandlers[payload.action](this.chatService, client, updatedPayload);

  }
}
