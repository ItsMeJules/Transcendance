import { io, Socket } from 'socket.io-client';
import { ReactElement, createContext, useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from './User';

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
  const newSocket = io(namespace, {
    withCredentials: true,
  });
  return newSocket;
};

export default function Websocket({ children }: WebsocketProps): JSX.Element {
  const [socketInstances, setSocketInstances] = useState<OpenedSockets>({
    general: null,
    game: null,
  });
  let userData: UserData;

  useEffect((): (() => void) => {
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      userData = JSON.parse(storedUserData);
      const general =
        socketInstances.general?.connected !== true
          ? OpenSocket("http://localhost:8000/general")
          : socketInstances.general;
      const game =
        socketInstances.game?.connected !== true
          ? OpenSocket("http://localhost:8000/game")
          : socketInstances.game;

      setSocketInstances({ general: general, game: game });

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
