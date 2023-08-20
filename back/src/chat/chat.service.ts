import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Room, Message } from '@prisma/client';
import { SendMsgRoomDto, JoinRoomDto, CreateRoomDto } from './dto';
import { CompleteRoom, CompleteUser } from 'src/utils/complete.type';

@Injectable()
export class ChatService {
  constructor(private prismaService: PrismaService) {}

  async sendMessageToRoom(
    messageDto: SendMsgRoomDto,
    client: Socket,
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
    client: Socket,
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

  async modifyPassword(roomName: string, client: Socket): Promise<string> {
    // encode pw later
    try {
      const currentRoom = await this.prismaService.returnCompleteRoom(roomName);
      const password: string = client.data.password;
      if (currentRoom.ownerId !== client.data.id)
        throw new Error('No permission');
      if (currentRoom.password === password) throw new Error('same password');
      if (password === '') {
        await this.prismaService.room.update({
          where: { name: currentRoom.name },
          data: {
            password: null,
          },
        });
      } else {
        await this.prismaService.room.update({
          where: { name: currentRoom.name },
          data: {
            password: password,
          },
        });
      }
      return password;
    } catch (error) {
      console.log(error);
    }
  }

  async createRoom(
    createRoomDto: CreateRoomDto,
    client: Socket,
  ): Promise<Room> {
    // encode pw later
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
    // encode pw later
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

  async disconnectRoom(roomName: string, client: Socket): Promise<void> {
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

  hierarchyCheck(
    room: CompleteRoom,
    actingUser: CompleteUser,
    target: CompleteUser,
  ): boolean {
    if (target.id === room.ownerId) return false;
    if (actingUser.id === room.ownerId) return true;
    if (
      room.admins.some((admin) => admin.id === actingUser.id) &&
      room.admins.some((admin) => admin.id === target.id)
    )
      return false;
    if (room.admins.some((admin) => admin.id === actingUser.id)) return true;
    return false;
  }

  async promoteToAdminToggle(roomName: string, client: Socket): Promise<void> {
    try {
      const actingUser = await this.prismaService.returnCompleteUser(
        client.data.id,
      );
      const targetUser = await this.prismaService.returnCompleteUser(
        client.data.id, // add targetUserId
      );
      const room = await this.prismaService.returnCompleteRoom(roomName);
      if (this.hierarchyCheck(room, actingUser, targetUser))
        throw new Error("You don't have permission");
      if (room.admins.some((admin) => admin.id === targetUser.id)) {
        await this.prismaService.room.update({
          where: {
            name: roomName,
          },
          data: {
            admins: {
              disconnect: {
                id: targetUser.id,
              },
            },
          },
        });
      } else {
        await this.prismaService.room.update({
          where: {
            name: roomName,
          },
          data: {
            admins: {
              connect: {
                id: targetUser.id,
              },
            },
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async banUser(roomName: string, client: Socket): Promise<void> {
    try {
      const actingUser = await this.prismaService.returnCompleteUser(
        client.data.id,
      );
      const targetUser = await this.prismaService.returnCompleteUser(
        client.data.id, // add targetUserId
      );
      const room = await this.prismaService.returnCompleteRoom(roomName);
      if (!room) {
        throw new Error('no room');
      }
      if (this.hierarchyCheck(room, actingUser, targetUser)) {
        await this.prismaService.room.update({
          where: { id: room.id },
          data: {
            users: {
              disconnect: {
                id: targetUser.id,
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

  async kickUserRoom(roomName: string, client: Socket): Promise<boolean> {
    try {
      const actingUser = await this.prismaService.returnCompleteUser(
        client.data.id,
      );
      const targetUser = await this.prismaService.returnCompleteUser(
        client.data.id, // add targetUserId !!
      ); //
      const room = await this.prismaService.returnCompleteRoom(roomName);
      if (!room) {
        throw new Error('no room');
      }
      if (this.hierarchyCheck(room, actingUser, targetUser)) {
        await this.prismaService.room.update({
          where: { id: room.id },
          data: {
            users: {
              disconnect: {
                id: targetUser.id,
              },
            },
          },
        });
        return true;
      } else throw new Error("You don't have permission");
    } catch (error) {
      console.log(error);
    }
  }
}
