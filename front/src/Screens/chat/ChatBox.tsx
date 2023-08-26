import { createContext, useEffect, useState } from "react";

import "./ChatBox.scss";

import { useWebsocketContext } from "../../Wrappers/Websocket";
import { useAppDispatch, useAppSelector } from "../../redux/Store";
import ChatContainer from "./chat_container/ChatContainer";
import ChatBar from "./chatbar/ChatBar";
import ChatMetadata from "./metadata/ChatMetadata";
import { fetchActiveChannel } from "../../redux/reducers/ChannelSlice";


export enum ChatSocketEventType {
  JOIN_ROOM = "join-room",
  CHAT_ACTION = "chat-action",
  MESSAGE = "message"
}

export enum ChatSocketActionType {
  CREATE_CHANNEL = "create-channel",
  SWITCH_CHANNEL = "switch-channel",
  SEND_MESSAGE = "send-message",
}

export const SendDataContext = createContext<null | ((action: ChatSocketActionType, data: any) => void)>(null)

export const ChatBox = () => {
  const [chatToggled, setChatToggled] = useState<boolean>(true);

  const dispatch = useAppDispatch()
  const chatSocket = useWebsocketContext().chat;
  const { currentRoom: activeChannelName } = useAppSelector(store => store.user.userData)

  useEffect(() => {
    if (chatSocket == null)
      return

    chatSocket.on(ChatSocketEventType.JOIN_ROOM, (payload: any) => {
      try {
        dispatch(fetchActiveChannel())
      } catch (error) {
        console.log("There was an error fetching the data", error);
      }
    })

    return () => {
      if (chatSocket == null)
        return

      chatSocket.off(ChatSocketEventType.JOIN_ROOM)
    }
  }, [dispatch, chatSocket, activeChannelName])

  const sendData = (action: ChatSocketActionType, data: any) => {
    let eventType = ChatSocketEventType.MESSAGE;

    switch (action) {
      case ChatSocketActionType.CREATE_CHANNEL:
        eventType = ChatSocketEventType.CHAT_ACTION
        data = {
          ...data,
          action: "createRoom"
        }
        break;
      case ChatSocketActionType.SWITCH_CHANNEL:
        eventType = ChatSocketEventType.CHAT_ACTION
        data = {
          ...data,
          action: "joinRoom"
        }
        break;
      case ChatSocketActionType.SEND_MESSAGE:
        data = {
          message: data,
          roomName: activeChannelName
        }
        break;
      default:
        break;
    }

    console.log(data)
    chatSocket?.emit(eventType, data)
  };

  const togglerTransition = {
    height: chatToggled ? "50vh" : "0vh",
  };

  return (
    <div className="chat-container">
      <SendDataContext.Provider value={sendData}>
        <div className="toggler" style={togglerTransition}>
          <ChatMetadata />
          <ChatContainer />
        </div>

        <ChatBar chatToggled={chatToggled} setChatToggled={setChatToggled} />
      </SendDataContext.Provider>
    </div>
  );
};
