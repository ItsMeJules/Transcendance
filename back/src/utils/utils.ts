import { Socket } from 'socket.io';

export enum ChatSocketEventType {
  JOIN_ROOM = 'join-room',
  MESSAGE = 'message',
  FETCH_MESSAGES = `fetch-messages`,
  CHAT_ACTION = 'chat-action',
  ROOM_ACTION = 'room-action',
  ACKNOWLEDGEMENTS = 'acknowledgements',
}

export enum RoomSocketActionType {
  BAN = 'ban',
  UNBAN = 'unban',
  PROMOTE = 'promote',
  DEMOTE = 'demote',
  MUTE = 'mute',
  UNMUTE = 'unmute',
  KICK = 'kick',
  INVITE = 'invite',
  USERS_ON_ROOM = `users-on-room`,
  USERS_BANNED = 'users-banned',
}

export const extractAccessTokenFromCookie = (client: Socket) => {
  const access_token_to_clean = client.handshake.headers.cookie;
  if (!access_token_to_clean) return null;
  return access_token_to_clean.split('=')[1];
};
