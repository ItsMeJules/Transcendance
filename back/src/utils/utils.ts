import { Socket } from 'socket.io';

export enum ChatSocketEventType {
  JOIN_ROOM = 'join-room',
  MESSAGE = 'message',
  CHAT_ACTION = 'chat-action',
  ROOM_ACTION = 'room-action',
}

export enum RoomSocketActionType {
  USERS_ON_ROOM = `users-on-room`,
}

export const extractAccessTokenFromCookie = (client: Socket) => {
  const access_token_to_clean = client.handshake.headers.cookie;
  if (!access_token_to_clean) return null;
  return access_token_to_clean.split('=')[1];
};
