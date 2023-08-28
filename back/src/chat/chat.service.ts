import { Injectable } from '@nestjs/common';
import { Message, Room, RoomType } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompleteRoom, CompleteUser } from 'src/utils/complete.type';
import * as ChatDtos from './dto';
import { BlockDto } from './dto/block.dto';
import { ChatSocketEventType } from 'src/utils';
import { UserSocketsService } from './user-sockets/user-sockets.service';

@Injectable()
export class ChatService {
  constructor(
    private prismaService: PrismaService,
    private userSocketsService: UserSocketsService,
  ) {}

  async connectToRoom(client: Socket, targetRoom: string): Promise<void> {
    try {
      const user = await this.prismaService.returnCompleteUser(client.data.id);
      const room = await this.prismaService.returnCompleteRoom(targetRoom);

      if (!room || !user) throw new Error('error name');

      await client.leave(user.currentRoom);
      console.log('client id leaving room : ', client.data.id);

      await client.join(targetRoom);
      await this.prismaService.user.update({
        where: { id: user.id },
        data: {
          // currentRoom: targetRoom,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async sendMessageToRoom(
    client: Socket,
    sendMsgRoomDto: ChatDtos.SendMsgRoomDto,
    server: Server,
  ): Promise<void> {
    try {
      console.log('sendMessageToRoom function beginning');
      const room = await this.prismaService.returnCompleteRoom(
        sendMsgRoomDto.roomName,
      );

      if (room.mutes.some((muted) => client.data.id === muted.id))
        throw new Error('user is muted until :'); //time

      const messageData = {
        text: sendMsgRoomDto.message,
        authorId: client.data.id,
        clientId: client.id,
      };
      await this.prismaService.message.create({
        data: { ...messageData, roomId: room.id },
      });

      // implement the "block" feature.
      server
        .to(sendMsgRoomDto.roomName)
        .emit(ChatSocketEventType.MESSAGE, messageData);

      console.log(
        'message sent : ',
        messageData,
        'to room : ',
        sendMsgRoomDto.roomName,
      );
      console.log('sendMessageToRoom function end');
    } catch (error) {
      console.log(error);
    }
  }

  async createOrReturnGeneralChat(): Promise<Room> {
    let generalChat = await this.prismaService.room.findUnique({
      where: { id: 1 },
    });
    if (!generalChat)
      generalChat = await this.prismaService.room.create({
        data: { name: 'general' },
      });

    return generalChat;
  }

  async createRoom(
    client: Socket,
    createRoomDto: ChatDtos.CreateRoomDto,
  ): Promise<Room> {
    // encode pw later add functions
    try {
      console.log('createRoom function beginning');
      let room = await this.prismaService.room.findUnique({
        where: { name: createRoomDto.roomName },
      });

      if (room)
        throw new Error(
          "room already exists with the name '" + createRoomDto.roomName + "'",
        );

      room = await this.prismaService.room.create({
        data: {
          type: RoomType[createRoomDto.type],
          name: createRoomDto.roomName,
          password: createRoomDto.password,
          ownerId: client.data.id,
          users: { connect: { id: client.data.id } },
          admins: { connect: { id: client.data.id } },
        },
      });

      await this.joinRoom(client, {
        roomName: createRoomDto.roomName,
        password: createRoomDto.password,
        server: createRoomDto.server,
      });

      console.log('createRoom function ending');
      return room;
    } catch (error) {
      console.log(error);
    }
  }

  async fetchMessagesOnRoomForUser(
    // I need the user's profile picture & name. For now I hardcode mine.
    client: Socket,
    fetchRoomDto: ChatDtos.FetchRoomDto,
  ): Promise<Message[]> {
    try {
      const messages = await this.prismaService.allMessagesFromRoom(
        fetchRoomDto.roomName,
      );
      const usersBlocked = await this.prismaService.allBlockedUsersFromUser(
        client.data.id,
      );

      const messagesWithClientId = messages.map((currentMessage) => {
        const isAuthorBanned = usersBlocked.some(
          (bannedUser) => bannedUser.id === currentMessage.authorId,
        );

        if (isAuthorBanned) {
          return {
            ...currentMessage,
            text: 'blocked message',
          };
        }

        return {
          ...currentMessage,
          profilePicture:
            'https://cdn.intra.42.fr/users/d97b6212aaf900daa3e64abff472b7b8/jpeyron.jpg', // Here's my picture.
          userName: 'jpeyron',
        };
      });

      return messagesWithClientId;
    } catch (error) {
      console.log(error);
    }
  }

  async joinRoom(
    client: Socket,
    joinRoomDto: ChatDtos.JoinRoomDto,
  ): Promise<Room> {
    // encode pw later + pay attention to behavior
    try {
      console.log('joinRoom function beginning');
      const room = await this.prismaService.returnCompleteRoom(
        joinRoomDto.roomName,
      );
      const user = await this.prismaService.user.findUnique({
        where: { id: client.data.id },
      });

      if (!room || !user) throw new Error('error name');

      if (room.password && room.password !== joinRoomDto.password)
        throw new Error('wrong password'); // change this

      if (room.bans.some((banned) => banned.id === user.id))
        throw new Error('user is banned from the room');

      await client.leave(user.currentRoom);
      console.log('client id leaving room : ', user.currentRoom);

      await client.join(joinRoomDto.roomName);
      console.log('client id joining room : ', joinRoomDto.roomName);

      await this.prismaService.user.update({
        where: { id: user.id },
        data: { currentRoom: joinRoomDto.roomName },
      });

      joinRoomDto.server
        .to(client.id)
        .emit(ChatSocketEventType.JOIN_ROOM, joinRoomDto.roomName);

      return room;
    } catch (error) {
      console.log(error);
    }
  }

  async leaveRoom(client: Socket, leaveDto: ChatDtos.LeaveDto): Promise<void> {
    try {
      const room = await this.prismaService.returnCompleteRoom(
        leaveDto.roomName,
      );
      await this.prismaService.room.update({
        where: { id: room.id },
        data: { users: { disconnect: { id: client.data.id } } },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async blockUserToggle(client: Socket, blockDto: BlockDto): Promise<void> {
    console.log('blockUserToggle function beginning');
    try {
      const blockedUsers = await this.prismaService.allBlockedUsersFromUser(
        client.data.id,
      );

      if (client.data.id === blockDto.targetId)
        throw new Error("you can't block yourself");

      if (blockedUsers.some((banned) => banned.id === blockDto.targetId)) {
        await this.prismaService.user.update({
          where: { id: client.data.id },
          data: { blockedUsers: { disconnect: { id: blockDto.targetId } } },
        });

        console.log('unblocking');
      } else {
        await this.prismaService.user.update({
          where: { id: client.data.id },
          data: { blockedUsers: { connect: { id: blockDto.targetId } } },
        });

        console.log('blocking');
      }
      console.log('blockUserToggle function end');
    } catch (error) {
      console.log(error);
    }
  }

  ///////////////////////////// ROOM FUNCTIONS \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

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

  async promoteToAdminToggle(
    client: Socket,
    promoteDto: ChatDtos.PromoteDto,
  ): Promise<void> {
    try {
      const actingUser = await this.prismaService.returnCompleteUser(
        client.data.id,
      );
      const targetUser = await this.prismaService.returnCompleteUser(
        promoteDto.targetId, // add targetUserId
      );
      const room = await this.prismaService.returnCompleteRoom(
        promoteDto.roomName,
      );

      if (this.hierarchyCheck(room, actingUser, targetUser))
        throw new Error("You don't have permission");

      if (room.admins.some((admin) => admin.id === targetUser.id)) {
        await this.prismaService.room.update({
          where: { name: promoteDto.roomName },
          data: { admins: { disconnect: { id: targetUser.id } } },
        });
      } else {
        await this.prismaService.room.update({
          where: { name: promoteDto.roomName },
          data: { admins: { connect: { id: targetUser.id } } },
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async banUserToggle(client: Socket, banDto: ChatDtos.BanDto): Promise<void> {
    try {
      const actingUser = await this.prismaService.returnCompleteUser(
        client.data.id,
      );
      const targetUser = await this.prismaService.returnCompleteUser(
        banDto.targetId,
      );
      const room = await this.prismaService.returnCompleteRoom(banDto.roomName);
      if (!room) {
        throw new Error('no room');
      }
      if (this.hierarchyCheck(room, actingUser, targetUser)) {
        if (room.bans.some((banned) => banned.id === targetUser.id)) {
          await this.prismaService.room.update({
            where: { id: room.id },
            data: {
              users: {
                disconnect: {
                  id: targetUser.id,
                },
              },
              bans: {
                connect: {
                  id: targetUser.id,
                },
              },
            },
          });
        } else {
          await this.prismaService.room.update({
            where: { id: room.id },
            data: {
              users: {
                connect: {
                  id: targetUser.id,
                },
              },
              bans: {
                disconnect: {
                  id: targetUser.id,
                },
              },
            },
          });
        }
      } else throw new Error("You don't have permission");
    } catch (error) {
      console.log(error);
    }
  }

  async muteUserFromRoomToggle(
    client: Socket,
    muteDto: ChatDtos.MuteDto,
  ): Promise<void> {
    try {
      const actingUser = await this.prismaService.returnCompleteUser(
        client.data.id,
      );
      const targetUser = await this.prismaService.returnCompleteUser(
        muteDto.targetId, // add targetUserId !!
      );
      const room = await this.prismaService.returnCompleteRoom(
        muteDto.roomName,
      );
      if (!room) {
        throw new Error('no room');
      }
      if (this.hierarchyCheck(room, actingUser, targetUser)) {
        if (room.mutes.some((muted) => muted.id === targetUser.id)) {
          await this.prismaService.room.update({
            where: { id: room.id },
            data: {
              mutes: {
                disconnect: {
                  id: targetUser.id,
                },
              },
            },
          });
        } else {
          await this.prismaService.room.update({
            where: { id: room.id },
            data: {
              mutes: {
                disconnect: {
                  id: targetUser.id,
                },
              },
            },
          });
        }
      } else throw new Error("You don't have permission");
    } catch (error) {
      console.log(error);
    }
  }

  async userJoinRoom(
    userId: number,
    roomName: string,
    server: Server,
  ): Promise<boolean> {
    try {
      console.log('userJoinRoom function beginning');
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      const userSocket = this.userSocketsService.getUserSocket(String(userId));
      const room = await this.prismaService.returnCompleteRoom(roomName);
      if (!room) throw new Error('no room');
      console.log('socket id : ', userSocket);
      server.to(userSocket.id).emit(ChatSocketEventType.JOIN_ROOM, roomName);
      console.log('userJoinRoom function end');
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async kickUserRoom(
    client: Socket,
    kickDto: ChatDtos.KickDto,
  ): Promise<boolean> {
    try {
      console.log('begining kickUserRoom function');
      const actingUser = await this.prismaService.returnCompleteUser(
        client.data.id,
      );
      const targetUser = await this.prismaService.returnCompleteUser(
        kickDto.targetId, // add targetUserId
      );
      const room = await this.prismaService.returnCompleteRoom(
        kickDto.roomName,
      );
      if (!room) {
        throw new Error('no room');
      }
      if (this.hierarchyCheck(room, actingUser, targetUser)) {
        await this.prismaService.room.update({
          where: { name: room.name },
          data: {
            users: {
              disconnect: {
                id: targetUser.id,
              },
            },
          },
        });
        await this.prismaService.user.update({
          where: {
            id: targetUser.id,
          },
          data: {
            currentRoom: 'general',
          },
        });
        await this.userJoinRoom(targetUser.id, 'general', kickDto.server);
        console.log('kicked');
        return true;
      } else throw new Error("You don't have permission");
    } catch (error) {
      console.log(error);
    }
  }

  async modifyPassword(
    client: Socket,
    modifyPasswordDto: ChatDtos.ModifyPasswordDto,
  ): Promise<string> {
    // encode pw later
    try {
      const currentRoom = await this.prismaService.returnCompleteRoom(
        modifyPasswordDto.roomName,
      );
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

  async inviteUser(
    client: Socket,
    inviteDto: ChatDtos.InviteDto,
  ): Promise<void> {
    try {
      const room = await this.prismaService.returnCompleteRoom(
        inviteDto.roomName,
      );
      // Permission check behavior?
      const targetUser = await this.prismaService.returnCompleteUser(
        inviteDto.targetId,
      ); // careful target!
      if (room.users.some((active) => active.id === targetUser.id)) {
        throw new Error('user already in room');
      } else if (room.bans.some((banned) => banned.id === targetUser.id))
        throw new Error('user is banned from the room');
      else {
        await this.joinRoom(client, {
          roomName: room.name,
          password: room.password,
          server: inviteDto.server,
        }); // behavior for private rooms?
      }
    } catch (error) {
      console.log(error);
    }
  }
}
