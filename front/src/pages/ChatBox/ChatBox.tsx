import { createContext, useEffect, useState } from "react";

import "./ChatBox.scss";

import { useWebsocketContext } from "services/Websocket/Websocket";
import { useAppDispatch, useAppSelector } from "utils/redux/Store";
import { setActiveChannel, setActiveChannelMessages } from "utils/redux/reducers/ChannelSlice";
import { setUserActiveChannel } from "utils/redux/reducers/UserSlice";
import ChatContainer from "./chat_container/ChatContainer";
import ChatBar from "./chatbar/ChatBar";
import ChatMetadata from "./metadata/ChatMetadata";
import PayloadAction from "./models/PayloadSocket";
import {
  ChatSocketActionType,
  ChatSocketEventType,
  RoomSocketActionType,
} from "./models/TypesActionsEvents";

export const SendDataContext = createContext<null | ((action: string, data: PayloadAction) => void)>(null);

export const ChatBox = () => {
  const [chatToggled, setChatToggled] = useState<boolean>(true);

  const chatSocket = useWebsocketContext().chat;
  const dispatch = useAppDispatch();
  const { currentRoom: activeChannelName } = useAppSelector((store) => store.user.userData);

  useEffect(() => {
    // console.log("out here");
    chatSocket?.on(ChatSocketEventType.JOIN_ROOM, (payload: any) => {
      // console.log(payload);
      dispatch(setUserActiveChannel(payload.name));
      dispatch(setActiveChannel(payload));
    });

    chatSocket?.on(ChatSocketEventType.FETCH_MESSAGES, (payload: any) => {
      payload = payload.map((message: any) => {
        return {
          authorId: message.authorId,
          text: message.text,
          userName: message.userName,
          profilePicture: message.profilePicture,
        };
      });
      dispatch(setActiveChannelMessages(payload));
    });

    return () => {
      chatSocket?.off(ChatSocketEventType.FETCH_MESSAGES);
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
        <ChatMetadata chatToggled={chatToggled} />
        <ChatContainer />
        <ChatBar chatToggled={chatToggled} setChatToggled={setChatToggled} />
      </SendDataContext.Provider>
    </div>
  );
};

export default ChatBox;
