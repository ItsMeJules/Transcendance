import { io, Socket } from 'socket.io-client';
import { APP_URL, SOCKET_GENERAL } from '../Utils';

const socketUrl = 'http://localhost:8000/general';
// const socketUrl = APP_URL + SOCKET_GENERAL;
// const socketUrl = '/socket';

let socket: Socket | null = null;

export const connectSocket = () => {

  console.log("inside connect socket");
  if (!socket) {
    // console.log('Connecting socket for user:', userId);
    socket = io(socketUrl, {
      // reconnection: true,
      // reconnectionAttempts: 5,
    });

    socket.on("general_online", (data: any) => {
      console.log('data received:', data);
    });

    // socket.on("connect", () => {
    //   if (socket) {
    //     console.log(socket.id);
    //     // socket.off("connect");
    //   }
    // });
    // Listen on test
    // socket.on('user_status_update', (data) => {
    //   console.log("Status update:", data);
    // })

    // socket.on('userStatus', ({ userId, status }: { userId: string; status: boolean }) => {
    //   setFriendOnlineStatus((prevStatus) => ({ ...prevStatus, [userId]: status }));
    // });
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
    // throw new Error('Socket has not been initialized.');
  }
  console.log("____SOCKET OK____")

  return socket;
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
  } catch (error)
    {
      console.error('Error asking friend online status:', error);
      throw error;
    }
  };

  export default socket;
