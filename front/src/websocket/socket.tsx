import { io, Socket } from 'socket.io-client';
import { API_URL } from '../utils';

const SERVER_URL = API_URL;

let socket: Socket;

export const initSocket = (userId: string) => {
  socket = io("/socket", { query: { userId } });
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket has not been initialized.');
  }
  return socket;
};
