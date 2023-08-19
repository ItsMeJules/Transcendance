import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Room, Message, User } from '@prisma/client';
import { SendMsgRoomDto, JoinRoomDto, CreateRoomDto } from './dto';
import { CompleteRoom } from 'src/utils/complete.type';

@Injectable()
export class ChatService {
  constructor(
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  // async fetchMessages(client: any, server: Server): Promise<Message> {}

  async sendMessageToRoom(
    messageDto: SendMsgRoomDto,
    client: any,
    server: Server,
    roomName: string,
  ): Promise<void> {
    try {
      const room = await this.prismaService.returnCompleteRoom(roomName);
      await this.prismaService.message.create({
        data: {
          text: messageDto.text,
          roomId: room.id,
          authorId: messageDto.authorID,
          clientId: client.id,
        },
      });

      server.emit('message', {
        text: messageDto.text,
        authorId: client.data.id,
        clientId: client.id,
      });
      console.log('message sent');
    } catch (error) {
      console.log(error);
    }
  }

  async sendMessage(
    payload: string,
    client: any,
    server: Server,
  ): Promise<void> {
    try {
      await this.prismaService.message.create({
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

  async createRoom(createRoomDto: CreateRoomDto, client: any): Promise<Room> {
    let room = await this.prismaService.room.findUnique({
      where: { name: createRoomDto.name },
    });
    if (room) {
      throw new Error(
        "room already exists with the name '" + createRoomDto.name + "'",
      );
    }
    room = await this.prismaService.room.create({
      data: {
        name: createRoomDto.name,
        password: createRoomDto.password,
        ownerId: client.data.id,
        users: {
          connect: {
            id: client.data.id,
          },
        },
        admins: {
          connect: {
            id: client.data.id,
          },
        },
      },
    });
    return room;
  }

  async joinRoom(joinRoomDto: JoinRoomDto, client: Socket): Promise<Room> {
    const room = await this.prismaService.room.findUnique({
      where: { name: joinRoomDto.name },
    });
    if (!room) {
      throw new Error('no room');
    }
    if (room.password) {
      if (room.password !== joinRoomDto.password) {
        throw new Error('wrong password');
      }
    }
    await this.prismaService.room.update({
      where: { id: room.id },
      data: {
        users: {
          connect: {
            id: client.data.id,
          },
        },
      },
    });
    return room;
  }

  async disconnectRoom(roomName: string, client: Socket) {
    try {
      const room = await this.prismaService.returnCompleteRoom(roomName);
      await this.prismaService.room.update({
        where: { id: room.id },
        data: {
          users: {
            disconnect: {
              id: client.data.id,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  privilegeUpperCheck(
    room: CompleteRoom,
    emitter: User,
    target: User,
  ): boolean {
    if (target.id === room.ownerId) return false;
    if (!room.admins.some((admin) => admin.id === emitter.id))
      // Learn more some()
      return true;
    return false;
  }

  async banUser(roomName: string, client: Socket): Promise<void> {
    const idBanning = client.data.id;
    const idToBan = client.data.id; // Add real idToBan
    try {
      const roomNow = await this.prismaService.returnCompleteRoom(roomName);
      if (!roomNow) {
        throw new Error('no room');
      }
      if (this.privilegeUpperCheck(roomNow, idBanning, idToBan)) {
        await this.prismaService.room.update({
          where: { id: roomNow.id },
          data: {
            users: {
              disconnect: {
                id: idToBan,
              },
            },
          },
        });
      } else throw new Error("You don't have permission");
    } catch (error) {
      console.log(error);
    }
  }

  async blockUserToggle(client: Socket, idBlockToggle: number): Promise<void> {
    try {
      const blockedUsers = await this.prismaService.allBlockedUsersFromUser(
        client.data.id,
      );
      if (blockedUsers.some((banned) => banned.id === idBlockToggle)) {
        await this.prismaService.user.update({
          where: { id: client.data.id },
          data: {
            blockedUsers: {
              disconnect: {
                id: idBlockToggle,
              },
            },
          },
        });
      } else {
        await this.prismaService.user.update({
          where: { id: client.data.id },
          data: {
            blockedUsers: {
              connect: {
                id: idBlockToggle,
              },
            },
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async fetchMessagesOnRoomForUser(
    roomName: string,
    client: Socket,
  ): Promise<Message[]> {
    try {
      const messages = await this.prismaService.allMessagesFromRoom(roomName);
      const usersBanned = await this.prismaService.allBlockedUsersFromUser(
        client.data.id,
      );
      const messagesWithClientId = messages.map((currentMessage) => {
        const isAuthorBanned = usersBanned.some(
          (bannedUser) => bannedUser.id === currentMessage.authorId,
        );

        if (isAuthorBanned) {
          return {
            ...currentMessage,
            text: 'blocked message',
          };
        }

        return currentMessage;
      });
      return messagesWithClientId;
    } catch (error) {
      console.log(error);
    }
  }

  async promoteToAdmin(roo);
}
