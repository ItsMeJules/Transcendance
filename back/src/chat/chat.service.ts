import {
  AcknowledgementType,
  AcknowledgementPayload,
} from './partial_types/partial.types';
import { Injectable } from '@nestjs/common';
import { Message, Room, RoomType } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatSocketEventType, RoomSocketActionType } from 'src/utils';
import { CompleteRoom, CompleteUser } from 'src/utils/complete.type';
import * as ChatDtos from './dto';
import { BlockDto } from './dto/block.dto';
import { UserSocketsService } from './user-sockets/user-sockets.service';

// Optis if time:
// dont return complete tables, only relation fields needed for checks.
// add a global check for room actions but not invite because of banned users.
// refacto all function especially create room.
// ? add time mutes ?
// move sends to other service
@Injectable()
export class ChatService {
  constructor(
    private prismaService: PrismaService,
    private userSocketsService: UserSocketsService,
  ) {}

  sendError(client: Socket, error: Error): void {
    const payload: AcknowledgementPayload = {
      message: error.message,
      type: AcknowledgementType.ERROR,
    };
    if (client) {
      client.emit(ChatSocketEventType.ACKNOWLEDGEMENTS, payload);
    }
  }

  sendWarning(client: Socket, message: string): void {
    const payload: AcknowledgementPayload = {
      message: message,
      type: AcknowledgementType.WARNING,
    };
    if (client) {
      client.emit(ChatSocketEventType.ACKNOWLEDGEMENTS, payload);
    }
  }

  sendSuccess(
    client: Socket,
    message: string,
    userId?: number,
    actionType?: RoomSocketActionType,
  ): void {
    const payload: AcknowledgementPayload = {
      actionType: actionType,
      userId: userId,
      message: message,
      type: AcknowledgementType.SUCCESS,
    };
    if (client) {
      client.emit(ChatSocketEventType.ACKNOWLEDGEMENTS, payload);
    }
  }

  sendInfoToUser(client: Socket, message: string): void {
    const payload: AcknowledgementPayload = {
      message: message,
      type: AcknowledgementType.INFO,
    };
    if (client) {
      client.emit(ChatSocketEventType.ACKNOWLEDGEMENTS, payload);
    }
  }

  sendInformationToRoom(
    message: string,
    server: Server,
    roomName: string,
    except?: Socket | Socket[],
  ): void {
    const payload: AcknowledgementPayload = {
      message: message,
      type: AcknowledgementType.INFO,
    };
    let sockets: string[] = [];

    if (Array.isArray(except)) {
      sockets = except.map((socket) => socket.id);
      server
        .to(roomName)
        .except(sockets)
        .emit(ChatSocketEventType.ACKNOWLEDGEMENTS, payload); // if multiple non targeted sockets
    } else if (except) {
      server
        .to(roomName)
        .except(except.id)
        .emit(ChatSocketEventType.ACKNOWLEDGEMENTS, payload); // only one non targeted
    } else
      server.to(roomName).emit(ChatSocketEventType.ACKNOWLEDGEMENTS, payload); // everyone targeted
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
      const user = await this.prismaService.user.findUnique({
        where: { id: client.data.id },
      });

      if (room.mutes.some((muted) => client.data.id === muted.id))
        throw new Error('You are muted'); //time

      const messageData = {
        text: sendMsgRoomDto.message,
        authorId: client.data.id,
        clientId: client.id,
      };

      await this.prismaService.message.create({
        data: { ...messageData, roomId: room.id },
      });

      const pictureAndBlockedPayload = {
        text: sendMsgRoomDto.message,
        authorId: user.id,
        clientId: client.id,
        profilePicture: user.profilePicture, //TODO Change my picture.
        userName: user.username,
      };

      // implement the "block" feature.
      server
        .to(sendMsgRoomDto.roomName)
        .emit(ChatSocketEventType.MESSAGE, pictureAndBlockedPayload);

      console.log(
        'message sent : ',
        pictureAndBlockedPayload,
        'to room : ',
        sendMsgRoomDto.roomName,
      );
      console.log('sendMessageToRoom function end');
    } catch (error) {
      this.sendError(client, error);
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
        const firstUser = parseInt(createRoomDto.roomName.split('-')[1]);
        const secondUser = parseInt(createRoomDto.roomName.split('-')[2]);
        const otherId = firstUser === client.data.id ? secondUser : firstUser;
        const targetUser = await this.prismaService.user.findUnique({
          where: { id: otherId },
        });
        await this.userJoinRoom(
          client.data.id,
          createRoomDto.roomName,
          createRoomDto.server,
        );
        this.sendInfoToUser(
          client,
          'You are speaking with ' + targetUser.username,
        );
        return room;
      }

      if (createRoomDto.type === 'DIRECT') {
        const parts = createRoomDto.roomName.split('-');
        const firstUser = parseInt(parts[1]);
        const secondUser = parseInt(parts[2]);
        const otherId = firstUser === client.data.id ? secondUser : firstUser;
        const targetUser = await this.prismaService.user.findUnique({
          where: { id: otherId },
        });
        console.log('first & second: ', firstUser, secondUser);
        room = await this.prismaService.room.create({
          data: {
            type: RoomType[createRoomDto.type],
            name: createRoomDto.roomName,
            users: {
              connect: [{ id: firstUser }, { id: secondUser }],
            },
          },
        });
        await this.joinRoom(client, {
          roomName: createRoomDto.roomName,
          password: createRoomDto.password,
          server: createRoomDto.server,
        });
        this.sendInfoToUser(
          client,
          'You are speaking with ' + targetUser.username,
        );
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

      if (createRoomDto.type === 'PRIVATE') {
        await this.joinRoom(client, {
          roomName: createRoomDto.roomName,
          password: createRoomDto.password,
          server: createRoomDto.server,
        });
      }

      console.log('createRoom function ending');
      this.sendSuccess(
        client,
        `${room.type} room "${room.name}" has been created`,
      );
      return room;
    } catch (error) {
      this.sendError(client, error);
    }
  }

  async fetchMessagesOnRoomForUser(
    client: Socket,
    fetchRoomDto: ChatDtos.FetchRoomDto,
  ): Promise<Message[]> {
    try {
      const messages = await this.prismaService.allMessagesFromRoom(
        fetchRoomDto.roomName,
      );

      const messagesWithClientId = await Promise.all(
        messages.map(async (currentMessage) => {
          const userSender = await this.prismaService.user.findUnique({
            where: { id: currentMessage.authorId },
          });

          return {
            ...currentMessage,
            profilePicture: userSender.profilePicture,
            userName: userSender.username,
          };
        }),
      );

      return messagesWithClientId;
    } catch (error) {
      this.sendError(client, error);
    }
  }

  async sendAllUsersOnRoom(
    client: Socket,
    usersRoomDto: ChatDtos.UsersRoomDto,
  ): Promise<void> {
    try {
      const room = await this.prismaService.returnCompleteRoom(
        usersRoomDto.roomName,
      );

      if (!room) {
        throw new Error('no room named' + usersRoomDto.roomName);
      }

      const neededFields = room.users.map((user) => {
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
      this.sendError(client, error);
    }
  }

  async sendAllUsersBannedOnRoom(
    client: Socket,
    usersRoomDto: ChatDtos.UsersRoomDto,
  ): Promise<void> {
    try {
      const room = await this.prismaService.returnCompleteRoom(
        usersRoomDto.roomName,
      );

      if (!room) {
        throw new Error('no room named' + usersRoomDto.roomName);
      }

      const neededFields = room.bans.map((user) => {
        return {
          id: user.id,
          username: user.username,
          profilePicture: user.profilePicture,
          isOnline: user.isOnline,
        };
      });

      usersRoomDto.server
        .to(client.id)
        .emit(RoomSocketActionType.USERS_BANNED, { users: neededFields });
    } catch (error) {
      this.sendError(client, error);
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

      if (
        room.ownerId !== user.id &&
        room.admins.find((admin) => admin.id === user.id) === undefined &&
        room.password &&
        room.password !== joinRoomDto.password
      )
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

      let roomDisplayname = room.name;
      if (room.type === RoomType.DIRECT) {
        const [_, topId, lowId] = room.name.split('-').map(Number);
        const targetId = topId === user.id ? lowId : topId;
        roomDisplayname = room.users.find(
          (user) => user.id === targetId,
        )?.username;
      }

      joinRoomDto.server.to(client.id).emit(ChatSocketEventType.JOIN_ROOM, {
        ...room,
        displayname: roomDisplayname,
      });
      joinRoomDto.server
        .to(client.id)
        .emit(ChatSocketEventType.FETCH_MESSAGES, messagesWithClientId);
      if (room.type === RoomType.DIRECT) {
        this.sendInfoToUser(client, 'You are speaking with ' + roomDisplayname);
        return room;
      }

      this.sendInfoToUser(client, 'You joined "' + joinRoomDto.roomName + '"');

      this.sendInformationToRoom(
        `${user.username} joined the room`,
        joinRoomDto.server,
        room.name,
        client,
      );

      return room;
    } catch (error) {
      this.sendError(client, error);
    }
  }

  async leaveRoom(client: Socket, leaveDto: ChatDtos.LeaveDto): Promise<void> {
    try {
      console.log('leaveRoom function begin');
      const room = await this.prismaService.returnCompleteRoom(
        leaveDto.roomName,
      );
      if (room.name === 'general') {
        throw new Error("You can't leave the general channel");
      }
      if (room.type === RoomType.PRIVATE) {
        await this.prismaService.room.update({
          where: { name: room.name },
          data: { users: { disconnect: { id: client.data.id } } },
        });
      }
      if (room.admins.some((admin) => admin.id === client.data.id)) {
        await this.prismaService.room.update({
          where: { name: room.name },
          data: { admins: { disconnect: { id: client.data.id } } },
        });
      }
      if (client.data.id === room.ownerId) {
        await this.prismaService.room.update({
          where: { name: room.name },
          data: { ownerId: null },
        });
      }
      const actingUser = await this.prismaService.user.findUnique({
        where: { id: client.data.id },
      });
      if (room.type !== RoomType.DIRECT && room.name !== 'general') {
        console.log('room type is not direct');
        this.sendSuccess(
          client,
          'You left the room "' + room.name + '" with your privileges',
        );
        this.sendInformationToRoom(
          `${actingUser.username} left the room with his privileges`,
          leaveDto.server,
          room.name,
          this.userSocketsService.getUserSocket(String(actingUser.id)),
        );
      }
      await this.userJoinRoom(client.data.id, 'general', leaveDto.server);
      console.log('leaveRoom function end');
    } catch (error) {
      this.sendError(client, error);
    }
  }

  async blockUserToggle(client: Socket, blockDto: BlockDto): Promise<void> {
    // add REFETCH sur block pour instant blocked message
    console.log('blockUserToggle function beginning');
    try {
      const blockedUsers = await this.prismaService.allBlockedUsersFromUser(
        client.data.id,
      );
      const actingUser = await this.prismaService.user.findUnique({
        where: { id: client.data.id },
      });
      const targetUser = await this.prismaService.user.findUnique({
        where: { id: blockDto.targetId },
      });
      if (actingUser.id === targetUser.id)
        throw new Error("you can't block yourself");

      if (blockedUsers.some((banned) => banned.id === targetUser.id)) {
        await this.prismaService.user.update({
          where: { id: actingUser.id },
          data: { blockedUsers: { disconnect: { id: targetUser.id } } },
        });
        const messageActor = `You unblocked ${targetUser.username} ! You can now see his messages`;
        this.sendSuccess(
          client,
          messageActor,
          targetUser.id,
          RoomSocketActionType.UNBLOCK,
        );
        this.sendWarning(
          this.userSocketsService.getUserSocket(String(targetUser.id)),
          `You have been unblocked by ${actingUser.username}`,
        );
        console.log('unblocking');
      } else {
        await this.prismaService.user.update({
          where: { id: actingUser.id },
          data: { blockedUsers: { connect: { id: targetUser.id } } },
        });
        this.sendSuccess(
          client,
          'You blocked ' +
            targetUser.username +
            '! You cant see his messages now',
          targetUser.id,
          RoomSocketActionType.BLOCK,
        );
        this.sendWarning(
          this.userSocketsService.getUserSocket(String(targetUser.id)),
          'You have been blocked by ' + actingUser.username,
        );
        console.log('blocking');
      }
      console.log('blockUserToggle function end');
    } catch (error) {
      this.sendError(client, error);
    }
  }

  ////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  ////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  ////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  /////////////////////////////                \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  /////////////////////////////                \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
  //||||||||||||||||||||||||||| ROOM FUNCTIONS |||||||||||||||||||||||||||\\
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\                ///////////////////////////\\
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\                ///////////////////////////\\
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\////////////////////////////////////\\
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\////////////////////////////////////\\
  //\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\////////////////////////////////////\\

  hierarchyCheck(
    room: CompleteRoom,
    actingUser: CompleteUser,
    target: CompleteUser,
  ): boolean {
    if (target.id === room.ownerId)
      throw new Error(`${target.username} is the owner of ${room.name}`);
    if (actingUser.id === room.ownerId) return false;
    if (
      room.admins.some((admin) => admin.id === actingUser.id) &&
      room.admins.some((admin) => admin.id === target.id)
    )
      throw new Error(`${target.username} also is an admin of "${room.name}"`);
    if (room.admins.some((admin) => admin.id === actingUser.id)) return false;
    throw new Error(`Your social status is too low on this channel :(`);
  }

  // create promote and demote toggle is shitty
  async promoteToAdminToggle(
    client: Socket,
    promoteDto: ChatDtos.PromoteDto,
  ): Promise<void> {
    try {
      const room = await this.prismaService.returnCompleteRoom(
        promoteDto.roomName,
      );
      if (room.type === RoomType.DIRECT) {
        throw new Error("You can't promote in dms channels");
      }
      const actingUser = await this.prismaService.returnCompleteUser(
        client.data.id,
      );
      const targetUser = await this.prismaService.returnCompleteUser(
        promoteDto.targetId, // add targetUserId
      );

      if (actingUser.id === targetUser.id)
        throw new Error("You can't promote yourself...");

      if (this.hierarchyCheck(room, actingUser, targetUser))
        throw new Error("You don't have permission");

      if (room.admins.some((admin) => admin.id === targetUser.id)) {
        await this.prismaService.room.update({
          where: { name: promoteDto.roomName },
          data: { admins: { disconnect: { id: targetUser.id } } },
        });
        //////////////// NOTIFICATIONS BEGIN \\\\\\\\\\\\\\\\
        this.sendSuccess(
          client,
          'You demoted ' + targetUser.username,
          targetUser.id,
          RoomSocketActionType.DEMOTE,
        );
        this.sendWarning(
          this.userSocketsService.getUserSocket(String(targetUser.id)),
          'You have been demoted by ' + actingUser.username,
        );
        this.sendInformationToRoom(
          `${targetUser.username} has been demoted`,
          promoteDto.server,
          room.name,
          this.userSocketsService.getArrayUserSockets([
            actingUser.id,
            targetUser.id,
          ]),
        );
        //////////////// NOTIFICATIONS END \\\\\\\\\\\\\\\\
        console.log(targetUser.username + ' is demoted');
      } else {
        await this.prismaService.room.update({
          where: { name: promoteDto.roomName },
          data: { admins: { connect: { id: targetUser.id } } },
        });
        //////////////// NOTIFICATIONS BEGIN \\\\\\\\\\\\\\\\
        this.sendSuccess(
          client,
          'You promoted ' + targetUser.username,
          targetUser.id,
          RoomSocketActionType.PROMOTE,
        );
        this.sendWarning(
          this.userSocketsService.getUserSocket(String(targetUser.id)),
          'You have been promoted by ' + actingUser.username,
        );
        this.sendInformationToRoom(
          `${targetUser.username} has been promoted`,
          promoteDto.server,
          room.name,
          this.userSocketsService.getArrayUserSockets([
            actingUser.id,
            targetUser.id,
          ]),
        );
        //////////////// NOTIFICATIONS END \\\\\\\\\\\\\\\\
        console.log(targetUser.username + ' is promoted');
      }
    } catch (error) {
      this.sendError(client, error);
    }
  }

  // roomActionsCheck();

  async banUserToggle(client: Socket, banDto: ChatDtos.BanDto): Promise<void> {
    try {
      console.log('banUserToggle function beginning');
      const room = await this.prismaService.returnCompleteRoom(banDto.roomName);
      if (room.type === RoomType.DIRECT) {
        throw new Error("You can't ban in dms channels");
      }
      const actingUser = await this.prismaService.returnCompleteUser(
        client.data.id,
      );
      const targetUser = await this.prismaService.returnCompleteUser(
        banDto.targetId,
      );
      if (!room) {
        throw new Error('no room');
      }
      if (actingUser.id === targetUser.id)
        throw new Error("You can't ban yourself");
      if (this.hierarchyCheck(room, actingUser, targetUser)) {
        throw new Error("You don't have permission");
      }
      if (!room.bans.some((banned) => banned.id === targetUser.id)) {
        // VVVV Removing 'visible' adding 'ban' VVVV
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
        // VVVV if user is in the room, he is also kicked VVVV
        if (targetUser.currentRoom === room.name)
          await this.userJoinRoom(targetUser.id, 'general', banDto.server);
        this.sendSuccess(
          client,
          'You banned ' + targetUser.username,
          targetUser.id,
          RoomSocketActionType.BAN,
        );
        this.sendWarning(
          this.userSocketsService.getUserSocket(String(targetUser.id)),
          'You have been banned by ' + actingUser.username,
        );
        this.sendInformationToRoom(
          `${targetUser.username} has been banned`,
          banDto.server,
          room.name,
          this.userSocketsService.getArrayUserSockets([
            actingUser.id,
            targetUser.id,
          ]),
        );
        console.log('banned user:', targetUser.id);
        // throw : You have been banned from the room : {roomName}
      } else {
        // VVVV adding 'visible' removing 'ban' VVVV
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
        this.sendSuccess(
          client,
          'You unbanned ' + targetUser.username,
          targetUser.id,
          RoomSocketActionType.UNBAN,
        );
        this.sendWarning(
          this.userSocketsService.getUserSocket(String(targetUser.id)),
          'You have been unbanned by ' + actingUser.username,
        );
        this.sendInformationToRoom(
          `${targetUser.username} has been unbanned`,
          banDto.server,
          room.name,
          this.userSocketsService.getArrayUserSockets([
            actingUser.id,
            targetUser.id,
          ]),
        );
        console.log('unbanned user:', targetUser.id);
      }
      console.log('banUserToggle function ending');
    } catch (error) {
      this.sendError(client, error);
    }
  }

  async muteUserFromRoomToggle(
    client: Socket,
    muteDto: ChatDtos.MuteDto,
  ): Promise<void> {
    try {
      console.log('muteUserFromRoomToggle function beginning');
      const room = await this.prismaService.returnCompleteRoom(
        muteDto.roomName,
      );
      if (room.type === RoomType.DIRECT) {
        throw new Error("You can't mute in dms channels");
      }
      const actingUser = await this.prismaService.returnCompleteUser(
        client.data.id,
      );
      const targetUser = await this.prismaService.returnCompleteUser(
        muteDto.targetId,
      );
      if (actingUser.id === targetUser.id)
        throw new Error("You can't mute yourself");
      if (!room) {
        throw new Error('No room');
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
        this.sendSuccess(
          client,
          'You muted ' + targetUser.username,
          targetUser.id,
          RoomSocketActionType.MUTE,
        );
        this.sendWarning(
          this.userSocketsService.getUserSocket(String(targetUser.id)),
          'You have been muted by ' + actingUser.username,
        );
        this.sendInformationToRoom(
          `${targetUser.username} has been muted`,
          muteDto.server,
          room.name,
          this.userSocketsService.getArrayUserSockets([
            actingUser.id,
            targetUser.id,
          ]),
        );
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
        this.sendSuccess(
          client,
          'You unmuted ' + targetUser.username,
          targetUser.id,
          RoomSocketActionType.UNMUTE,
        );
        this.sendWarning(
          this.userSocketsService.getUserSocket(String(targetUser.id)),
          'You have been unmuted by ' + actingUser.username,
        );
        this.sendInformationToRoom(
          `${targetUser.username} has been unmuted`,
          muteDto.server,
          room.name,
          this.userSocketsService.getArrayUserSockets([
            actingUser.id,
            targetUser.id,
          ]),
        );
      }
      console.log('muteUserFromRoomToggle function ending');
    } catch (error) {
      this.sendError(client, error);
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
      console.log('user socket id : ', userSocket.id);
      console.log('making him switch channel to ', roomName);
      // VVVV Change currentRoom VVVV
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          currentRoom: roomName,
        },
      });
      // VVVV Change Socket listening room VVVV
      await userSocket.leave(user.currentRoom);
      await userSocket.join(roomName);
      console.log(
        'user socket id : ',
        userSocket.id,
        'leaving room : ',
        user.currentRoom,
        'joining room : ',
        roomName,
      );
      // VVVV Emitting to the user joinRoom VVVV
      let roomDisplayname = room.name;
      if (room.type === RoomType.DIRECT) {
        const [_, topId, lowId] = room.name.split('-').map(Number);
        const targetId = topId === user.id ? lowId : topId;
        roomDisplayname = room.users.find(
          (user) => user.id === targetId,
        )?.username;
      }

      server.to(userSocket.id).emit(ChatSocketEventType.JOIN_ROOM, {
        ...room,
        displayname: roomDisplayname,
      });

      const messagesWithClientId = await this.fetchMessagesOnRoomForUser(
        userSocket,
        {
          roomName: roomName,
          server: server,
        },
      );
      // VVVV Emitting the joined room's messages VVVV
      server
        .to(userSocket.id)
        .emit(ChatSocketEventType.FETCH_MESSAGES, messagesWithClientId); // NOT SURE ABOUT THIS ONE
      console.log('userJoinRoom function end');
      return true;
    } catch (error) {
      this.sendError(
        this.userSocketsService.getUserSocket(String(userId)),
        error,
      );
    }
  }

  async kickUserRoom(
    client: Socket,
    kickDto: ChatDtos.KickDto,
  ): Promise<boolean> {
    try {
      console.log('begining kickUserRoom function');
      const room = await this.prismaService.returnCompleteRoom(
        kickDto.roomName,
      );
      if (room.type === RoomType.DIRECT) {
        throw new Error("You can't kick in dms channels");
      }
      const actingUser = await this.prismaService.returnCompleteUser(
        client.data.id, // ok man
      );
      const targetUser = await this.prismaService.returnCompleteUser(
        kickDto.targetId, // add targetUserId
      );
      if (!room) {
        throw new Error('no room');
      }
      if (actingUser.id === targetUser.id)
        throw new Error("You can't kick yourself");
      console.log(targetUser.currentRoom, room.name);
      if (this.hierarchyCheck(room, actingUser, targetUser)) {
        throw new Error("You don't have permission");
      }
      if (targetUser.currentRoom !== room.name) {
        throw new Error('user is not the room you fkin golem');
      }
      this.sendSuccess(
        client,
        'You kicked ' + targetUser.username,
        targetUser.id,
        RoomSocketActionType.KICK,
      );
      this.sendWarning(
        this.userSocketsService.getUserSocket(String(targetUser.id)),
        'You have been kicked by ' + actingUser.username,
      );
      this.sendInformationToRoom(
        `${targetUser.username} has been kicked`,
        kickDto.server,
        room.name,
        this.userSocketsService.getArrayUserSockets([
          actingUser.id,
          targetUser.id,
        ]),
      );
      await this.userJoinRoom(targetUser.id, 'general', kickDto.server);
      console.log('kicked');
      return true;
    } catch (error) {
      this.sendError(client, error);
    }
  }

  async modifyPassword(
    client: Socket,
    modifyPasswordDto: ChatDtos.ModifyPasswordDto,
  ): Promise<string> {
    // encode pw later
    try {
      console.log('modifyPassword function beginning');
      const currentRoom = await this.prismaService.returnCompleteRoom(
        modifyPasswordDto.roomName,
      );
      if (currentRoom.type === RoomType.DIRECT) {
        throw new Error("You can't modify the password of dms channels");
      }
      const password = modifyPasswordDto.password;
      if (currentRoom.ownerId !== client.data.id)
        throw new Error('You need to own the channel to modify the password');
      if (currentRoom.password === password)
        throw new Error('You need a different password');
      if (password === '') {
        await this.prismaService.room.update({
          where: { name: currentRoom.name },
          data: {
            password: null,
          },
        });
        this.sendSuccess(client, 'You removed the password');
      } else {
        await this.prismaService.room.update({
          where: { name: currentRoom.name },
          data: {
            password: password,
          },
        });
        this.sendSuccess(client, 'You modified the password');
      }
      console.log('modifyPassword function beginning');
      return 'euuuuh';
    } catch (error) {
      this.sendError(client, error);
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
      if (room.type === RoomType.DIRECT) {
        throw new Error("You can't invite in dms channels");
      }
      // Permission check behavior?
      console.log('1');
      const actingUser = await this.prismaService.user.findUnique({
        where: { id: client.data.id },
      });
      const targetUser = await this.prismaService.returnCompleteUser(
        inviteDto.targetId,
      ); // careful target!
      console.log('2');
      if (room.type !== RoomType.PRIVATE)
        throw new Error('you cannot invite in ' + room.type + 'S rooms');
      if (room.users.some((active) => active.id === targetUser.id)) {
        throw new Error('user already in room');
      } else if (
        room.bans.some((banned) => banned.id === targetUser.id) &&
        client.data.id !== room.ownerId
      )
        throw new Error(
          'user is banned from the room and youre not the owner of the room',
        );
      else if (
        room.bans.some((banned) => banned.id === targetUser.id) &&
        client.data.id !== room.ownerId
      ) {
        await this.prismaService.room.update({
          where: { name: inviteDto.roomName },
          data: {
            bans: { disconnect: { id: targetUser.id } },
            users: { connect: { id: targetUser.id } },
          },
        });
      } else {
        await this.prismaService.room.update({
          where: { name: inviteDto.roomName },
          data: { users: { connect: { id: targetUser.id } } },
        });
      }
      console.log('3');
      this.sendSuccess(client, 'You invited ' + targetUser.username);
      console.log('4');
      console.log(
        'usersocket = ',
        this.userSocketsService.getUserSocket(String(targetUser.id)),
      );
      this.sendSuccess(
        this.userSocketsService.getUserSocket(String(targetUser.id)),
        'You have been invited by ' +
          actingUser.username +
          ' to "' +
          room.name +
          '"',
      );
      console.log('5');
    } catch (error) {
      this.sendError(client, error);
    }
  }
}
