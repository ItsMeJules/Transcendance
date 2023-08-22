import * as ChatDtos from '../dto';
import { ChatService } from '../chat.service';
import { Socket, Server } from 'socket.io';
import { Room, Message } from '@prisma/client';

export const ActionChatHandlers = {
  block: async (
    chatService: ChatService,
    client: Socket,
    idBlockToggle: number,
  ): Promise<void> => chatService.blockUserToggle(client, idBlockToggle),
  unblock: async (
    chatService: ChatService,
    client: Socket,
    idBlockToggle: number,
  ): Promise<void> => chatService.blockUserToggle(client, idBlockToggle),
  message: async (
    chatService: ChatService,
    messageDto: ChatDtos.SendMsgRoomDto,
    client: Socket,
    server: Server,
    roomName: string,
  ): Promise<void> =>
    chatService.sendMessageToRoom(messageDto, client, server, roomName),
  createRoom: async (
    chatService: ChatService,
    createRoomDto: ChatDtos.CreateRoomDto,
    client: Socket,
  ): Promise<Room> => chatService.createRoom(createRoomDto, client),
  fetchHistory: async (
    chatService: ChatService,
    roomName: string,
    client: Socket,
  ): Promise<Message[]> =>
    chatService.fetchMessagesOnRoomForUser(roomName, client),
  joinRoom: async (
    chatService: ChatService,
    joinRoomDto: ChatDtos.JoinRoomDto,
    client: Socket,
    userJoining: number,
  ): Promise<Room> => chatService.joinRoom(joinRoomDto, client, userJoining),
  leaveRoom: async (
    chatService: ChatService,
    roomName: string,
    client: Socket,
  ): Promise<void> => chatService.leaveRoom(roomName, client),
};

export const ActionRoomHandlers = {
  ban: async (
    chatService: ChatService,
    roomName: string,
    client: Socket,
  ): Promise<void> => chatService.banUserToggle(roomName, client),
  unban: async (
    chatService: ChatService,
    roomName: string,
    client: Socket,
  ): Promise<void> => chatService.banUserToggle(roomName, client),
  promote: async (
    chatService: ChatService,
    roomName: string,
    client: Socket,
  ): Promise<void> => chatService.promoteToAdminToggle(roomName, client),
  demote: async (
    chatService: ChatService,
    roomName: string,
    client: Socket,
  ): Promise<void> => chatService.promoteToAdminToggle(roomName, client),
  mute: async (
    chatService: ChatService,
    roomName: string,
    client: Socket,
  ): Promise<void> => chatService.muteUserFromRoomToggle(roomName, client),
  unmute: async (
    chatService: ChatService,
    roomName: string,
    client: Socket,
  ): Promise<void> => chatService.muteUserFromRoomToggle(roomName, client),
  kick: async (
    chatService: ChatService,
    roomName: string,
    client: Socket,
  ): Promise<boolean> => chatService.kickUserRoom(roomName, client),
  changePassword: async (
    chatService: ChatService,
    roomName: string,
    client: Socket,
  ): Promise<string> => chatService.modifyPassword(roomName, client),
  invite: async (
    chatService: ChatService,
    roomName: string,
    client: Socket,
    target: number,
  ): Promise<void> => chatService.inviteUser(roomName, client, target),
};
