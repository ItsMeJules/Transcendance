import { io, Socket } from 'socket.io-client';

const socketUrl = `http://${process.env.REACT_APP_LOCAL_IP}:8000/general`;

let socket: Socket | null = null;

export const connectSocket = () => {

  if (!socket) {
    socket = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: 2,
    });

    socket.on("general_online", (data: any) => {
    });

    const user = localStorage.getItem('userData');
    if (user) {
      let userJSON: any;
      userJSON = JSON.parse(user);
      socket.on(`user_${userJSON.id}`, (data: any) => {
      });
    }
    return socket;
  }
};

export const sendMessage = (message: string) => {
  if (socket) {
    socket.emit('message', message);
  }
};

export const getSocket = () => {
  if (!socket) {
    return;
  }

  return socket;
};

export const deregisterSocket = (
  socket: Socket
): void => {
  setTimeout(() => {
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
