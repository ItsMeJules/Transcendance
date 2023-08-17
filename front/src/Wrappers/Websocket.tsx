import { io, Socket } from "socket.io-client";
import { APP_URL, SOCKET_GENERAL } from "../Utils";
import {
  ReactElement,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import User from "../Services/User";
import { UserData } from "../Services/User";
import { getNameOfJSDocTypedef } from "typescript";

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
  socket.off("online");
};

const closeOpenSockets = (sockets: OpenedSockets): void => {
  if (sockets.general) deregisterSocket(sockets.general);
  if (sockets.chat) deregisterSocket(sockets.chat);
  if (sockets.game) deregisterSocket(sockets.game);
};

const OpenSocket = (namespace: string): Socket => {
  console.log("opening socket for:", namespace);
  const newSocket = io(namespace, {
    withCredentials: true,
  });
  return newSocket;
};

export default function Websocket({ children }: WebsocketProps): JSX.Element {
  const history = useNavigate();
  const [socketInstances, setSocketInstances] = useState<OpenedSockets>({
    general: null,
    chat: null,
    game: null,
  });
  let userData: UserData;

  useEffect((): (() => void) => {
    const storedUserData = localStorage.getItem("userData");

    console.log("Here_____________");
    if (storedUserData) {
      userData = JSON.parse(storedUserData);
      console.log("userstate:", userData);
      const general =
        socketInstances.general?.connected !== true 
          ? OpenSocket("http://localhost:8000/general")
          : socketInstances.general;
      const chat =
        socketInstances.chat?.connected !== true
          ? OpenSocket("http://localhost:8000/chat")
          : socketInstances.chat;
      const game =
        socketInstances.game?.connected !== true
          ? OpenSocket("http://localhost:8000/game")
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
  }, [localStorage.getItem("userData")]);

  return (
    <WebsocketContext.Provider value={socketInstances}>
      {children}
    </WebsocketContext.Provider>
  );
}

export const useWebsocketContext: () => OpenedSockets = () => {
  return useContext(WebsocketContext);
};
