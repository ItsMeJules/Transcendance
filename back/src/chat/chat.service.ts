import { Injectable } from '@nestjs/common';
import { Message, Room, RoomType, User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { CompleteRoom, CompleteUser } from 'src/utils/complete.type';
import * as ChatDtos from './dto';
import { BlockDto } from './dto/block.dto';
import { ChatSocketEventType, RoomSocketActionType } from 'src/utils';
import { UserSocketsService } from './user-sockets/user-sockets.service';

@Injectable()
export class ChatService {
  constructor(
    private prismaService: PrismaService,
    private userSocketsService: UserSocketsService,
  ) {}

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

      console.log(
        'room.mutes.ids : ',
        room.mutes.map((muted) => muted.id),
        'client.data.id : ',
        client.data.id,
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

  async getCompleteRoom(roomName: string): Promise<CompleteRoom> {
    try {
      return this.prismaService.returnCompleteRoom(roomName);
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

      if (room && createRoomDto.type !== RoomType.DIRECT) {
        throw new Error(
          "room already exists with the name '" + createRoomDto.roomName + "'",
        );
      }

      // Make user join the room if its a DM
      if (room && createRoomDto.type === RoomType.DIRECT) {
        await this.userJoinRoom(
          client.data.id,
          createRoomDto.roomName,
          createRoomDto.server,
        );
      }

      if (createRoomDto.type === 'DIRECT') {
        const parts = createRoomDto.roomName.split('-');
        const firstUser = parseInt(parts[1]);
        const secondUser = parseInt(parts[2]);
        console.log('first & second: ', firstUser, secondUser);
        room = await this.prismaService.room.create({
          data: {
            type: RoomType[createRoomDto.type],
            name: createRoomDto.roomName,
            users: {
              connect: [{ id: firstUser }, { id: secondUser }],
            },
            admins: { connect: { id: client.data.id } },
          },
        });
        await this.joinRoom(client, {
          roomName: createRoomDto.roomName,
          password: createRoomDto.password,
          server: createRoomDto.server,
        });
        console.log('createRoom for DMs function ending');
        return room;
      }

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

      if (createRoomDto.type === 'PUBLIC') {
        const allUsers = await this.prismaService.user.findMany();
        await this.prismaService.room.update({
          where: { id: room.id },
          data: {
            users: {
              set: allUsers.map((user) => ({ id: user.id })),
            },
          },
        });
      }

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

  async sendAllUsersOnRoom(
    client: Socket,
    usersRoomDto: ChatDtos.UsersRoomDto,
  ): Promise<void> {
    try {
      const users = await this.prismaService.allUsersFromRoom(
        usersRoomDto.roomName,
      );

      const neededFields = users.map((user) => {
        return {
          id: user.id,
          username: user.username,
          profilePicture: user.profilePicture,
          isOnline: user.isOnline,
        };
      });

      usersRoomDto.server
        .to(client.id)
        .emit(RoomSocketActionType.USERS_ON_ROOM, { users: neededFields });
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
      const messagesWithClientId = await this.fetchMessagesOnRoomForUser(
        client,
        {
          roomName: joinRoomDto.roomName,
          server: joinRoomDto.server,
        },
      );

      if (!room || !user) throw new Error('error name');

      if (room.password && room.password !== joinRoomDto.password)
        throw new Error('wrong password'); // change this

      if (room.bans.some((banned) => banned.id === user.id))
        throw new Error('user is banned from the room');
      if (!room.users.some((users) => users.id === user.id))
        throw new Error("user hasn't been invite in this room");

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
        .emit(ChatSocketEventType.JOIN_ROOM, room);
      joinRoomDto.server
        .to(client.id)
        .emit(ChatSocketEventType.FETCH_MESSAGES, messagesWithClientId);

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
      if (room.type === RoomType.PRIVATE) {
        await this.prismaService.room.update({
          where: { name: room.name },
          data: { users: { disconnect: { id: client.data.id } } },
        });
      }
      await this.userJoinRoom(client.data.id, 'general', leaveDto.server);
      // if (client.data.id === room.ownerId) {
      //   await this.prismaService.room.delete({ where: { id: room.id } });
      // }
      if (client.data.id === room.ownerId) {
        await this.prismaService.room.update({
          where: { name: room.name },
          data: { ownerId: null },
        });
      }
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
    console.log('hierarchyCheck function beginning');
    console.log('target.id : ', target.id);
    console.log('roomOwner.id : ', room.ownerId);
    if (target.id === room.ownerId) return true;
    if (actingUser.id === room.ownerId) return false;
    if (
      room.admins.some((admin) => admin.id === actingUser.id) &&
      room.admins.some((admin) => admin.id === target.id)
    )
      return true;
    if (room.admins.some((admin) => admin.id === actingUser.id)) return false;
    console.log('hierarchyCheck function end');
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

      if (actingUser.id === targetUser.id)
        throw new Error("You can't use actions on yourself");

      if (this.hierarchyCheck(room, actingUser, targetUser))
        throw new Error("You don't have permission");

      if (room.admins.some((admin) => admin.id === targetUser.id)) {
        await this.prismaService.room.update({
          where: { name: promoteDto.roomName },
          data: { admins: { disconnect: { id: targetUser.id } } },
        });
        console.log(targetUser.username + ' is demoted');
      } else {
        await this.prismaService.room.update({
          where: { name: promoteDto.roomName },
          data: { admins: { connect: { id: targetUser.id } } },
        });
        console.log(targetUser.username + ' is promoted');
      }
    } catch (error) {
      console.log(error);
    }
  }

  async banUserToggle(client: Socket, banDto: ChatDtos.BanDto): Promise<void> {
    try {
      console.log('banUserToggle function beginning');
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
      if (actingUser.id === targetUser.id)
        throw new Error("You can't use actions on yourself");
      if (this.hierarchyCheck(room, actingUser, targetUser)) {
        throw new Error("You don't have permission");
      }
      if (!room.bans.some((banned) => banned.id === targetUser.id)) {
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
        if (targetUser.currentRoom === room.name)
          await this.userJoinRoom(targetUser.id, 'general', banDto.server);
        console.log('banned user:', targetUser.id);
        // throw : You have been banned from the room : {roomName}
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
        console.log('unbanned user:', targetUser.id);
      }
      console.log('banUserToggle function ending');
    } catch (error) {
      console.log(error);
    }
  }

  async muteUserFromRoomToggle(
    client: Socket,
    muteDto: ChatDtos.MuteDto,
  ): Promise<void> {
    try {
      console.log('muteUserFromRoomToggle function beginning');
      const actingUser = await this.prismaService.returnCompleteUser(
        client.data.id,
      );
      const targetUser = await this.prismaService.returnCompleteUser(
        muteDto.targetId,
      );
      const room = await this.prismaService.returnCompleteRoom(
        muteDto.roomName,
      );
      if (actingUser.id === targetUser.id)
        throw new Error("You can't use actions on yourself");
      if (!room) {
        throw new Error('no room');
      }
      if (this.hierarchyCheck(room, actingUser, targetUser)) {
        throw new Error("You don't have permission");
      }
      if (!room.mutes.some((muted) => muted.id === targetUser.id)) {
        await this.prismaService.room.update({
          where: { id: room.id },
          data: {
            mutes: {
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
            mutes: {
              disconnect: {
                id: targetUser.id,
              },
            },
          },
        });
      }
      console.log('muteUserFromRoomToggle function ending');
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
      console.log('user socket id : ', userSocket.id);
      console.log('making him switch channel to ', roomName);
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          currentRoom: roomName,
        },
      });
      await userSocket.leave(user.currentRoom);
      await userSocket.join(roomName);
      console.log('infos : ', ChatSocketEventType.JOIN_ROOM, roomName);
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
        client.data.id, // ok man
      );
      const targetUser = await this.prismaService.returnCompleteUser(
        kickDto.targetId, // add targetUserId
      );
      const room = await this.prismaService.returnCompleteRoom(
        kickDto.roomName,
      );
      if (actingUser.id === targetUser.id)
        throw new Error("You can't use actions on yourself");
      if (!room) {
        throw new Error('no room');
      }
      console.log(targetUser.currentRoom, room.name);
      if (this.hierarchyCheck(room, actingUser, targetUser)) {
        throw new Error("You don't have permission");
      }
      if (targetUser.currentRoom !== room.name) {
        throw new Error('user is not the room you fkin golem');
      }
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
      await this.userJoinRoom(targetUser.id, 'general', kickDto.server);
      console.log('kicked');
      return true;
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
      if (currentRoom.type === RoomType.DIRECT) {
        throw new Error("You can't modify the password of dms channels");
      }
      const password: string = client.data.password;
      if (currentRoom.ownerId !== client.data.id)
        throw new Error('you are not the owner');
      if (currentRoom.password === password) throw new Error('Same password');
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
      if (room.type !== RoomType.PRIVATE)
        throw new Error('you cannot invite in ' + room.type + 'S rooms');
      if (room.users.some((active) => active.id === targetUser.id)) {
        throw new Error('user already in room');
      } else if (room.bans.some((banned) => banned.id === targetUser.id))
        throw new Error('user is banned from the room');
      else {
        await this.prismaService.room.update({
          where: { name: inviteDto.roomName },
          data: { users: { connect: { id: targetUser.id } } },
        });
        // code client.emit('code', 'You can now access to the room : {roomName}')
      }
    } catch (error) {
      console.log(error);
    }
  }
}
