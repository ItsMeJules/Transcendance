import { Socket } from 'socket.io';

export const extractAccessTokenFromCookie = (client: Socket) => {
  const access_token_to_clean = client.handshake.headers.cookie;
  if (!access_token_to_clean) return null;
  return access_token_to_clean.split('=')[1];
};
