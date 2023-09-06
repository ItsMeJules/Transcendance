import * as ChatDtos from '../dto';
import { ChatService } from '../chat.service';
import { Socket } from 'socket.io';
import { Room, Message, User } from '@prisma/client';

export const ActionChatHandlers = {
  block: async (
    chatService: ChatService,
    client: Socket,
    blockDto: ChatDtos.BlockDto,
  ): Promise<void> => chatService.blockUserToggle(client, blockDto),
  unblock: async (
    chatService: ChatService,
    client: Socket,
    blockDto: ChatDtos.BlockDto,
  ): Promise<void> => chatService.blockUserToggle(client, blockDto),
  createRoom: async (
    chatService: ChatService,
    client: Socket,
    createRoomDto: ChatDtos.CreateRoomDto,
  ): Promise<Room> => chatService.createRoom(client, createRoomDto),
  fetchHistory: async (
    chatService: ChatService,
    client: Socket,
    fetchRoomDto: ChatDtos.FetchRoomDto,
  ): Promise<Message[]> =>
    chatService.fetchMessagesOnRoomForUser(client, fetchRoomDto),
  joinRoom: async (
    chatService: ChatService,
    client: Socket,
    joinRoomDto: ChatDtos.JoinRoomDto,
  ): Promise<Room> => chatService.joinRoom(client, joinRoomDto),
  leaveRoom: async (
    chatService: ChatService,
    client: Socket,
    leaveDto: ChatDtos.LeaveDto,
  ): Promise<void> => chatService.leaveRoom(client, leaveDto),
  changePassword: async (
    chatService: ChatService,
    client: Socket,
    modifyPasswordDto: ChatDtos.ModifyPasswordDto,
  ): Promise<string> => chatService.modifyPassword(client, modifyPasswordDto),
  inviteToPlay: async (
    chatService: ChatService,
    client: Socket,
    inviteToPlayDto: ChatDtos.InviteToPlayDto,
  ): Promise<void> => chatService.inviteToPlay(client, inviteToPlayDto),
  acceptInvitation: async (
    chatService: ChatService,
    client: Socket,
    acceptInvitationDto: ChatDtos.AcceptInvitationDto,
  ): Promise<void> => chatService.acceptInvitation(client, acceptInvitationDto),
  refuseInvitation: async (
    chatService: ChatService,
    client: Socket,
    acceptInvitationDto: ChatDtos.RefuseInvitationDto,
  ): Promise<void> => chatService.refuseInvitation(client, acceptInvitationDto),
};

export const ActionRoomHandlers = {
  ban: async (
    chatService: ChatService,
    client: Socket,
    banDto: ChatDtos.BanDto,
  ): Promise<void> => chatService.banUserToggle(client, banDto),
  unban: async (
    chatService: ChatService,
    client: Socket,
    banDto: ChatDtos.BanDto,
  ): Promise<void> => chatService.banUserToggle(client, banDto),
  promote: async (
    chatService: ChatService,
    client: Socket,
    promoteDto: ChatDtos.PromoteDto,
  ): Promise<void> => chatService.promoteToAdminToggle(client, promoteDto),
  demote: async (
    chatService: ChatService,
    client: Socket,
    promoteDto: ChatDtos.PromoteDto,
  ): Promise<void> => chatService.promoteToAdminToggle(client, promoteDto),
  mute: async (
    chatService: ChatService,
    client: Socket,
    muteDto: ChatDtos.MuteDto,
  ): Promise<void> => chatService.muteUserFromRoomToggle(client, muteDto),
  unmute: async (
    chatService: ChatService,
    client: Socket,
    muteDto: ChatDtos.MuteDto,
  ): Promise<void> => chatService.muteUserFromRoomToggle(client, muteDto),
  kick: async (
    chatService: ChatService,
    client: Socket,
    kickDto: ChatDtos.KickDto,
  ): Promise<boolean> => chatService.kickUserRoom(client, kickDto),
  invite: async (
    chatService: ChatService,
    client: Socket,
    inviteDto: ChatDtos.InviteDto,
  ): Promise<void> => chatService.inviteUser(client, inviteDto),
  getRoomUsers: async (
    chatService: ChatService,
    client: Socket,
    usersRoomDto: ChatDtos.UsersRoomDto,
  ): Promise<void> => chatService.sendAllUsersOnRoom(client, usersRoomDto),
  getBannedUsers: async (
    chatService: ChatService,
    client: Socket,
    usersRoomDto: ChatDtos.UsersRoomDto,
  ): Promise<void> =>
    chatService.sendAllUsersBannedOnRoom(client, usersRoomDto),
};
