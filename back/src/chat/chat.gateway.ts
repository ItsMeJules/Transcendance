import {
  BadRequestException,
  CanActivate,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RoomType, User } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { Server, Socket } from 'socket.io';
import { TwoFactorException } from 'src/auth/exceptions/two-factor.exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatSocketEventType, extractAccessTokenFromCookie } from 'src/utils';
import { AuthService } from '../auth/auth.service';
import { ChatService } from './chat.service';
import { PayloadActionDto } from './dto';
import {
  ActionChatHandlers,
  ActionRoomHandlers,
} from './handlers/handlers.map';
import { UserSocketsService } from './user-sockets/user-sockets.service';

interface JwtPayload {
  id: number;
  isTwoFactorAuthenticationVerified: boolean;
}

// @UseGuards(JwtGuard)
@WebSocketGateway({ namespace: 'chat' })
export class ChatEventsGateway {
  @WebSocketServer() server: Server;

  constructor(
    private chatService: ChatService,
    private userSocketsService: UserSocketsService,
    private prismaService: PrismaService,
  ) {}

  async validate(payload: {
    id: number;
    isTwoFactorAuthenticationVerified: boolean;
  }): Promise<User | { status: string }> {
    const user = await this.prismaService.findUserById(payload.id);
    if (!user) throw new BadRequestException('Bad token!!!!!');
    delete user.hash;
    return user;
  }

  async setupConnection(client: Socket): Promise<User | null> {
    const token = extractAccessTokenFromCookie(client);
    let user;
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = jwt.verify(token, process.env.jwtSecret) as JwtPayload;
      if (
        typeof payload === 'object' &&
        'id' in payload &&
        'isTwoFactorAuthenticationVerified' in payload
      ) {
        user = await this.validate(payload as JwtPayload);
      } else {
        throw new UnauthorizedException('Invalid token payload');
      }
      return user;
    } catch (err) { }
  }

  // return user;
  async handleConnection(client: Socket): Promise<void> {

    const user = await this.setupConnection(client);
    if (!user) {
      client.disconnect();
      return;
    }
    client.data = { id: user.id };
    await client.join(user.currentRoom);
    this.userSocketsService.addUserSocket(client.data.id, client);
    const currentCompleteRoom = await this.chatService.getCompleteRoom(
      user.currentRoom,
    );
    currentCompleteRoom.messages = [];

    const messagesWithClientId =
      await this.chatService.fetchMessagesOnRoomForUser(client, {
        roomName: user.currentRoom,
        server: this.server,
      });

    let roomDisplayname = currentCompleteRoom.name;
    if (currentCompleteRoom.type === RoomType.DIRECT) {
      const [_, topId, lowId] = currentCompleteRoom.name.split('-').map(Number);
      const targetId = topId === user.id ? lowId : topId;
      roomDisplayname = currentCompleteRoom.users.find(
        (user) => user.id === targetId,
      )?.username;
    }

    this.server.to(client.id).emit(ChatSocketEventType.JOIN_ROOM, {
      ...currentCompleteRoom,
      displayname: roomDisplayname,
    });

    this.server
      .to(client.id)
      .emit(ChatSocketEventType.FETCH_MESSAGES, messagesWithClientId);
  }

  async handleDisconnect(client: Socket): Promise<void> {
    try {
      if (!client.data.id) throw new Error('socket not instanciated');
      const userClient = await this.prismaService.user.findUnique({
        where: { id: client.data.id },
      });

      await this.leaveRoomAndRemoveUser(
        client,
        userClient.currentRoom,
        userClient.id,
      );
      this.removeEventListeners(client);
    } catch (error) { }
  }

  async leaveRoomAndRemoveUser(
    client: Socket,
    room: string,
    userId: number,
  ): Promise<void> {
    try {
      await client.leave(room);
      this.userSocketsService.removeUserSocket(String(userId));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  removeEventListeners(client: Socket): void {
    const eventTypes = [
      ChatSocketEventType.MESSAGE,
      ChatSocketEventType.CHAT_ACTION,
      ChatSocketEventType.ROOM_ACTION,
    ];

    eventTypes.forEach((eventType) => {
      client.off(eventType, () => {});
    });
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
    await ActionRoomHandlers[payload.action](
      this.chatService,
      client,
      newPayload,
    );
  }
}
