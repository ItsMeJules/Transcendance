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
import { UseGuards, Injectable } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, Room } from '@prisma/client';

@UseGuards(JwtGuard)
@Injectable()
export class ChatService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  async fetchMessages(client: any, server: Server) {}

  async sendMessage(payload: string, client: any, server: Server) {
    try {
      const message = await this.prismaService.message.create({
        data: {
          text: payload,
          roomId: 1,
          authorId: client.data.id,
          clientId: client.id,
        },
      });

      server.emit('message', {
        text: payload,
        authorId: client.data.id,
        clientId: client.id,
      });
      console.log('message sent');
    } catch (error) {
      console.log(error);
    }
  }

  async createOrReturnGeneralChat(): Promise<Room> {
    let generalChat = await this.prismaService.room.findUnique({
      where: { id: 1 },
    });
    if (!generalChat) {
      generalChat = await this.prismaService.room.create({
        data: {
          name: 'general',
        },
      });
    }
    return generalChat;
  }
}
