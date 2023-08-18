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
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { ChatService } from './chat.service';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

// @UseGuards(JwtGuard) // add jwt guard for chat auth
@WebSocketGateway({ namespace: 'chat' })
export class ChatEventsGateway {
  @WebSocketServer() server: Server;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private prismaService: PrismaService,
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

    const messages = await this.prismaService.message.findMany({
      where: {
        roomId: 1,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    const messagesWithClientId = messages.map((message) => ({
      ...message,
      clientId: user.id,
    }));
    console.log('messages :', messagesWithClientId);
    this.server.emit('load_general_chat_' + user.id, messagesWithClientId);
    console.log('load_general_chat_' + user.id, messagesWithClientId);
  }

  handleDisconnect(client: Socket): void {
    console.log('> chat deconnection ');
    client.off('message', () => console.log('chat!!!!'));
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: string,
  ): Promise<void> {
    // const access_token = extractAccessTokenFromCookie(clientno);
    // const user = await this.authService.validateJwtToken(access_token);
    console.log('client :', client);
    console.log('Received message: ', payload);
    console.log('userid ?: ', client.data, client.data.id, client.id);
    this.chatService.sendMessage(payload, client, this.server);
  }
}
