import { createContext, useEffect, useState } from "react";

import "./ChatBox.scss";

import { useWebsocketContext } from "../../Wrappers/Websocket";
import { useAppDispatch, useAppSelector } from "../../redux/Store";
import ChatContainer from "./chat_container/ChatContainer";
import ChatBar from "./chatbar/ChatBar";
import ChatMetadata from "./metadata/ChatMetadata";
import { fetchActiveChannel } from "../../redux/reducers/ChannelSlice";
import { setUserActiveChannel } from "../../redux/reducers/UserSlice";
import PayloadAction from "./models/PayloadSocket";
import {
  ChatSocketActionType,
  ChatSocketEventType,
  RoomSocketActionType,
} from "./models/TypesActionsEvents";

export const SendDataContext = createContext<
  null | ((action: string, data: PayloadAction) => void)
>(null);

export const ChatBox = () => {
  const [chatToggled, setChatToggled] = useState<boolean>(true);
  
  const chatSocket = useWebsocketContext().chat;
  const dispatch = useAppDispatch();
  const { currentRoom: activeChannelName } = useAppSelector((store) => store.user.userData);

  useEffect(() => {
    chatSocket?.on(ChatSocketEventType.JOIN_ROOM, (payload: any) => {
      dispatch(setUserActiveChannel(payload));

      try {
        dispatch(fetchActiveChannel());
      } catch (error) {
        console.log("There was an error fetching the data", error);
      }
    });

    return () => {
      chatSocket?.off(ChatSocketEventType.JOIN_ROOM);
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

    console.log("data is :", data, "on eventType :", eventType);
    chatSocket?.emit(eventType, data);
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
