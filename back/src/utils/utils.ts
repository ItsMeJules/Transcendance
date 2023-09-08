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
  BLOCK = `block`,
  UNBLOCK = `unblock`,
}

export const extractAccessTokenFromCookie = (client: Socket) => {
  const cookieString = client.handshake.headers.cookie;
  if (!cookieString) return null;

  const cookies = cookieString.split(';').map((cookie) => cookie.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split('=');
    if (name === 'access_token') {
      return value;
    }
  }

  return null;
};
