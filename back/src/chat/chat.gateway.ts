import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { ChatSocketEventType, extractAccessTokenFromCookie } from 'src/utils';
import { AuthService } from '../auth/auth.service';
import { ChatService } from './chat.service';
import { PayloadActionDto } from './dto';
import {
  ActionChatHandlers,
  ActionRoomHandlers,
} from './handlers/handlers.map';
import { UserSocketsService } from './user-sockets/user-sockets.service';

// @UseGuards(JwtGuard) // add jwt guard for chat auth
@WebSocketGateway({ namespace: 'chat' })
export class ChatEventsGateway {
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private userSocketsService: UserSocketsService,
  ) {}

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

    this.userSocketsService.addUserSocket(client.data.id, client);

    return user;
  }

  async handleConnection(client: Socket): Promise<void> {
    const user = this.setupConnection(client);

    user
      .then(async (user) => {
        await client.join(user.currentRoom);

        const currentCompleteRoom = await this.chatService.getCompleteRoom(
          user.currentRoom,
        );
        currentCompleteRoom.messages = [];

        const messagesWithClientId =
          await this.chatService.fetchMessagesOnRoomForUser(client, {
            roomName: user.currentRoom,
            server: this.server,
          });

        this.server
          .to(client.id)
          .emit(ChatSocketEventType.JOIN_ROOM, currentCompleteRoom);

        this.server
          .to(client.id)
          .emit(ChatSocketEventType.FETCH_MESSAGES, messagesWithClientId);
      })
      .catch((reason) => console.log(reason));
  }

  handleDisconnect(client: Socket): void {
    this.userSocketsService.removeUserSocket(client.data.id);
    console.log('removed socket data of user id : ', client.data.id);
    client.off(ChatSocketEventType.MESSAGE, () => console.log('chat !'));
    client.off(ChatSocketEventType.CHAT_ACTION, () =>
      console.log('chat action !'),
    );
    client.off(ChatSocketEventType.ROOM_ACTION, () =>
      console.log('room action !'),
    );
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
    const newPayload = { ...payload, server: this.server };
    if (newPayload.action === 'createRoom' && newPayload.type === 'PROTECTED') {
      newPayload.type = 'PUBLIC'; // careful
    }
    await ActionChatHandlers[payload.action](
      this.chatService,
      client,
      newPayload,
    );
  }

  @SubscribeMessage(ChatSocketEventType.ROOM_ACTION)
  async roomAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: PayloadActionDto,
  ): Promise<void> {
    const newPayload = { ...payload, server: this.server };
    console.log('room action payload: ', payload);
    await ActionRoomHandlers[payload.action](
      this.chatService,
      client,
      newPayload,
    );
  }
}
