import { io, Socket } from 'socket.io-client';

const socketUrl = 'http://localhost:8000/general';

let socket: Socket | null = null;

export const connectSocket = () => {

  if (!socket) {
    socket = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: 2,
    });

    socket.on("general_online", (data: any) => {
      console.log('data received:', data);
    });

    const user = localStorage.getItem('userData');
    if (user) {
      let userJSON: any;
      userJSON = JSON.parse(user);
      socket.on(`user_${userJSON.id}`, (data: any) => {
        console.log('data received:', data);
      });
      console.log('test:', `user_${userJSON.id}`);
    }
    return socket;
  }
};

export const sendMessage = (message: string) => {
  console.log("SEND MESSAGE");
  if (socket) {
    socket.emit('message', message);
  }
};

export const getSocket = () => {
  if (!socket) {
    console.log("NOOOOOOOOOOOOOO SOCKET");
    return;
  }
  console.log("____SOCKET OK____")

  return socket;
};

export const deregisterSocket = (
  socket: Socket
): void => {
  setTimeout(() => {
    console.log("disconnect triggered");
    socket.disconnect();
  }, 5000);
  socket.off("connect");
  socket.off("connect_error");
  socket.off("disconnect");
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const askFriendStatusSocketIO = (friendId: string | null) => {
  try {

    return new Promise((resolve) => {
      if (socket) {
        socket.emit('checkFriendOnline', friendId, (isOnline: boolean) => {
          resolve(isOnline);
        });
      }
    });
  } catch (error) {
    console.error('Error asking friend online status:', error);
    throw error;
  }
};

export default socket;
