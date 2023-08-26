import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

import "./ChatBox.scss";

import ChatBar from "./chatbar/ChatBar";
import ChatContainer from "./chat_container/ChatContainer";
import ChatMetadata from "./metadata/ChatMetadata";
import { useWebsocketContext } from "../../Wrappers/Websocket";
import { API_ROUTES } from "../../Utils";
import { ChatMessageData } from "./models/ChatMessageData";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { setUserActiveChannel } from "../../redux/slices/UserReducer";
import { transformToChannelData } from "./models/Channel";
import { addChannel } from "../../redux/slices/ChannelReducer";


enum ChatSocketEventType {
  JOIN_ROOM = "join-room",
  CHAT_ACTION = "chat-action",
}

export enum ChatSocketActionType {
  CREATE_CHANNEL = "create-channel",
  SWITCH_CHANNEL = "switch-channel",
  MESSAGE = "message"
}

export const SendDataContext = createContext<null | ((action: ChatSocketActionType, data: any) => void)>(null)

export const ChatBox = () => {
  const [chatToggled, setChatToggled] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);

  const dispatch = useAppDispatch()
  const { id: userId, activeChannel: activeChannelName } = useAppSelector(store => store.user.userData)

  const chatSocket = useWebsocketContext().chat;

  useEffect(() => {
    if (chatSocket == null)
      return

    const setupConnection = async (payload: any) => {
      try {
        const response = await axios.get(API_ROUTES.COMPLETE_ROOM, { withCredentials: true });

        dispatch(addChannel(transformToChannelData(response.data)))
        dispatch(setUserActiveChannel(payload.currentRoom))

        const receivedMessages: ChatMessageData[] = response.data.messages.reduce(
          (chatMessages: ChatMessageData[], message: any) => {
            chatMessages.push({
              message: message.text,
              self: message.authorId === userId,
              authorId: message.authorId,
              profilePicture: message.profilePicture,
              userName: message.userName,
            })

            return chatMessages
          }, [])

        setMessages(receivedMessages)
      } catch (error) {
        console.log("There was an error fetching the data", error);
      }
    };

    const onNewMessage = (payload: any) => {
      const message: ChatMessageData = {
        message: payload.text,
        self: payload.authorId === userId,
        authorId: payload.authorId,
        profilePicture: payload.profilePicture,
        userName: payload.userName,
      };

      setMessages((messages) => [...messages, message]);
    };

    chatSocket.on(ChatSocketEventType.JOIN_ROOM, setupConnection)
    chatSocket.on(ChatSocketActionType.MESSAGE, onNewMessage)

    return () => {
      if (chatSocket == null)
        return

      chatSocket.off(ChatSocketEventType.JOIN_ROOM)
      chatSocket.off(ChatSocketActionType.MESSAGE)
    }
  }, [dispatch, chatSocket, userId])

  useEffect(() => {

  }, [activeChannelName])

  const sendData = (action: ChatSocketActionType, data: any) => {
    console.log(action, data)
    chatSocket?.emit(action, { ...data, roomName: activeChannelName })
  };

  const togglerTransition = {
    height: chatToggled ? "50vh" : "0vh",
  };

  return (
    <div className="chat-container">
      <SendDataContext.Provider value={sendData}>
        <div className="toggler" style={togglerTransition}>
          <ChatMetadata />
          <ChatContainer messagesReceived={messages} />
        </div>

        <ChatBar chatToggled={chatToggled} setChatToggled={setChatToggled} />
      </SendDataContext.Provider>
    </div>
  );
};
