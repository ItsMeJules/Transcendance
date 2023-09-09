import { io, Socket } from "socket.io-client";
import { ReactElement, createContext, useEffect, useState, useContext } from "react";
import { useAppSelector } from "utils/redux/Store";
import { useAxios } from "utils/axiosConfig/axiosConfig";
import { API_ROUTES, APP_ROUTES } from "utils/routing/routing";

interface WebsocketProps {
  children: ReactElement;
}

interface OpenedSockets {
  general: Socket | null;
  chat: Socket | null;
  game: Socket | null;
}

const WebsocketContext = createContext<OpenedSockets>({
  general: null,
  chat: null,
  game: null,
});

const deregisterSocket = (socket: Socket): void => {
  setTimeout(() => {
    socket.disconnect();
  }, 5000);
};

const closeOpenSockets = (sockets: OpenedSockets): void => {
  if (sockets.general) deregisterSocket(sockets.general);
  if (sockets.chat) deregisterSocket(sockets.chat);
  if (sockets.game) deregisterSocket(sockets.game);
};

const OpenSocket = (namespace: string): Socket => {
  const newSocket = io(namespace, {
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
  });
  return newSocket;
};

export default function Websocket({ children }: WebsocketProps): JSX.Element {
  const customAxiosInstance = useAxios();
  const [socketInstances, setSocketInstances] = useState<OpenedSockets>({
    general: null,
    chat: null,
    game: null,
  });
  const { id: userId } = useAppSelector((state) => state.user.userData);
  useEffect((): (() => void) => {
    const checkToken = async () => {
      await customAxiosInstance.get(API_ROUTES.USER_FRIENDS, {
        withCredentials: true,
      });
    };
    checkToken();
    if (!userId) {
    } else if (userId) {
      const general =
        socketInstances.general?.connected !== true
          ? OpenSocket(`http://${process.env.REACT_APP_LOCAL_IP}:8000/general`)
          : socketInstances.general;
      const chat =
        socketInstances.chat?.connected !== true
          ? OpenSocket(`http://${process.env.REACT_APP_LOCAL_IP}:8000/chat`)
          : socketInstances.chat;
      const game =
        socketInstances.game?.connected !== true
          ? OpenSocket(`http://${process.env.REACT_APP_LOCAL_IP}:8000/game`)
          : socketInstances.game;
      setSocketInstances({ general: general, chat: chat, game: game });
    } else {
      closeOpenSockets(socketInstances);
      setSocketInstances({ general: null, chat: null, game: null });
    }

    return (): void => {
      closeOpenSockets(socketInstances);
      setSocketInstances({ general: null, chat: null, game: null });
    };
  }, [userId]);

  return (
    <WebsocketContext.Provider value={socketInstances}>{children}</WebsocketContext.Provider>
  );
}

export const useWebsocketContext: () => OpenedSockets = () => {
  return useContext(WebsocketContext);
};
