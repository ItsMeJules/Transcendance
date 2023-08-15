import { io, Socket } from 'socket.io-client';
import { APP_URL, SOCKET_GENERAL } from '../Utils';
import { ReactElement, createContext, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import User from '../Services/User';
import { UserData } from '../Services/User';
import { getNameOfJSDocTypedef } from 'typescript';

interface WebsocketProps {
  children: ReactElement;
}

interface OpenedSockets {
  general: Socket | null;
  // chat: Socket | null;
  game: Socket | null;
}

const WebsocketContext = createContext<OpenedSockets>({
  general: null,
  // chat: null,
  game: null,
})

const deregisterSocket = (socket: Socket): void => {
  setTimeout(() => {
    socket.disconnect();
  }, 5000);
  socket.off("online");
}

const closeOpenSockets = (sockets: OpenedSockets): void => {
  if (sockets.general) deregisterSocket(sockets.general);
  // if (sockets.chat) deregisterSocket(sockets.chat);
  if (sockets.game) deregisterSocket(sockets.game);
};

const OpenSocket = (namespace: string): Socket => {
  // console.log('opening socket for:', namespace);
  const newSocket = io(namespace, {
    withCredentials: true,
  });
  return newSocket;
};

export default function Websocket({ children }: WebsocketProps): JSX.Element {
  const history = useNavigate();
  const [socketInstances, setSocketInstances] = useState<OpenedSockets>({
    general: null,
    game: null,
  });
  let userData: UserData;

  useEffect((): (() => void) => {
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      userData = JSON.parse(storedUserData);
      // console.log("userstate:", userData);
      const general =
        socketInstances.general?.connected !== true
          ? OpenSocket("http://localhost:8000/general")
          : socketInstances.general;
      const game =
        socketInstances.game?.connected !== true
          ? OpenSocket("http://localhost:8000/game")
          : socketInstances.game;

      setSocketInstances({ general: general, game: game });

      // setSocketInstances({ general: generalSocket, game: getNa });
    } else {
      closeOpenSockets(socketInstances);
      setSocketInstances({ general: null, game: null });
    }

    return (): void => {
      closeOpenSockets(socketInstances);
      setSocketInstances({ general: null, game: null });
    }

  }, [localStorage.getItem('userData')])

  return (
    <WebsocketContext.Provider value={socketInstances}>
      {children}
    </WebsocketContext.Provider>
  );
}

export const useWebsocketContext: () => OpenedSockets = () => {
  return useContext(WebsocketContext);
};



// const socketUrl = 'http://localhost:8000/general';

// let socket: Socket | null = null;

// const connectSocket = () => {

//     // console.log("inside connect socket");
//     if (!socket) {
//         socket = io(socketUrl, {
//             reconnection: true,
//             reconnectionAttempts: 2,
//         });

//         socket.on("general_online", (data: any) => {
//             console.log('data received:', data);
//         });

//         const user = localStorage.getItem('userData');
//         if (user) {
//             let userJSON: any;
//             userJSON = JSON.parse(user);
//             socket.on(`user_${userJSON.id}`, (data: any) => {
//                 console.log('data received:', data);
//             });
//             console.log('test:', `user_${userJSON.id}`);
//         }
//         return socket;
//     }
// };

// const sendMessage = (message: string) => {
//     console.log("SEND MESSAGE");
//     if (socket) {
//         socket.emit('message', message);
//     }
// };

// export const getSocket = () => {
//     if (!socket) {
//         console.log("NOOOOOOOOOOOOOO SOCKET");
//         return;
//         // throw new Error('Socket has not been initialized.');
//     }
//     console.log("____SOCKET OK____")

//     return socket;
// };

// export const disconnectSocket = () => {
//     if (socket) {
//         socket.disconnect();
//         socket = null;
//     }
// };

// export const askFriendStatusSocketIO = (friendId: string | null) => {
//     try {

//         return new Promise((resolve) => {
//             if (socket) {
//                 socket.emit('checkFriendOnline', friendId, (isOnline: boolean) => {
//                     resolve(isOnline);
//                 });
//             }
//         });
//     } catch (error) {
//         console.error('Error asking friend online status:', error);
//         throw error;
//     }
// };

