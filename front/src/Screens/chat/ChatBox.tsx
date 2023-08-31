import { createContext, useEffect, useRef, useState } from "react";

import "./ChatBox.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWebsocketContext } from "../../Wrappers/Websocket";
import { useAppDispatch, useAppSelector } from "../../redux/Store";
import { setActiveChannel, setActiveChannelMessages } from "../../redux/reducers/ChannelSlice";
import { setUserActiveChannel } from "../../redux/reducers/UserSlice";
import ChatContainer from "./chat_container/ChatContainer";
import ChatBar from "./chatbar/ChatBar";
import ChatMetadata from "./metadata/ChatMetadata";
import PayloadAction from "./models/PayloadSocket";
import {
  ChatSocketActionType,
  ChatSocketEventType,
  RoomSocketActionType,
} from "./models/TypesActionsEvents";
import { ChannelMessageData } from "./models/Channel";

export const SendDataContext = createContext<
  null | ((action: string, data: PayloadAction) => void)
>(null);

interface SocketAcknowledgements {
  message: string;
  type: string;
}

export const ChatBox = () => {
  const [chatToggled, setChatToggled] = useState<boolean>(true);
  const chatSocket = useWebsocketContext().chat;
  const dispatch = useAppDispatch();
  const { currentRoom: activeChannelName } = useAppSelector((store) => store.user.userData);

  const displayAcknowledgements = (payload: SocketAcknowledgements) => {
    switch (payload.type) {
      case "info":
        toast(`${payload.message}`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }); //information
        break;
      case "error":
        toast.error(`Error: ${payload.message}`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }); //information
        break;
      case "success":
        toast.success(`${payload.message}`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }); //information
        break;
      case "warning":
        toast.warning(`${payload.message}`, {
          position: "bottom-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        }); //information
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // create payloads not any, create functions not callback in parameter
    chatSocket?.on(ChatSocketEventType.JOIN_ROOM, (payload: any) => {
      dispatch(setUserActiveChannel(payload.name))
      dispatch(setActiveChannel(payload));
    });

    chatSocket?.on(ChatSocketEventType.ACKNOWLEDGEMENTS, (payload: SocketAcknowledgements) =>
      displayAcknowledgements(payload)
    );
    
    chatSocket?.on(ChatSocketEventType.FETCH_MESSAGES, (payload: ChannelMessageData[]) => {
      dispatch(setActiveChannelMessages(payload)); // faire fonction
    });

    return () => {
      chatSocket?.off(ChatSocketEventType.FETCH_MESSAGES);
      chatSocket?.off(ChatSocketEventType.JOIN_ROOM);
      chatSocket?.off(ChatSocketEventType.ACKNOWLEDGEMENTS);
      chatSocket?.off(ChatSocketEventType.SUCCESS);
      chatSocket?.off(ChatSocketEventType.ERRORS);
    };
  }, [dispatch, chatSocket, activeChannelName]);

  function isChatSocketActionType(action: string): action is ChatSocketActionType {
    return Object.values(ChatSocketActionType).includes(action as ChatSocketActionType);
  }

  function isRoomSocketActionType(action: string): action is RoomSocketActionType {
    return Object.values(RoomSocketActionType).includes(action as RoomSocketActionType);
  }

  const sendData = (action: string, data: PayloadAction) => {
    let eventType = ChatSocketEventType.MESSAGE;

    if (isChatSocketActionType(action)) {
      eventType = ChatSocketEventType.CHAT_ACTION;
    }
    if (isRoomSocketActionType(action)) {
      if (!activeChannelName) return;
      data = { ...data, roomName: activeChannelName };
      eventType = ChatSocketEventType.ROOM_ACTION;
    }

    // console.log("data is :", data, "on eventType :", eventType);
    chatSocket?.emit(eventType, data);
  };

  const togglerTransition = {
    height: chatToggled ? "50vh" : "0vh",
  };

  return (
    <>
      <ToastContainer />
      <div className="chat-container">
        <SendDataContext.Provider value={sendData}>
          <div className="toggler" style={togglerTransition}>
            <ChatMetadata chatToggled={chatToggled} />
            <ChatContainer />
          </div>

          <ChatBar chatToggled={chatToggled} setChatToggled={setChatToggled} />
        </SendDataContext.Provider>
      </div>
      {/* <div className="errors">lol</div>
      <div className="acknowledgements">lol</div> */}
    </>
  );
};
