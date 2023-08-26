import { useState, useEffect, useRef } from "react";
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
  MESSAGE = "message",
  ROOM_MESSAGES = "room-messages",
  CHAT_ACTION = "chat-action",
}

enum ChatSocketActionType {
  CREATE_CHANNEL = "create-channel",
  SWITCH_CHANNEL = "switch-channel",
}

export const ChatBox = () => {
  const [chatToggled, setChatToggled] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);

  const dispatch = useAppDispatch()
  const { id: userId, activeChannel: activeChannelName } = useAppSelector(store => store.user.userData)

  const chatSocket = useWebsocketContext().chat;

  const onNewMessage = (payload: any) => {
    console.log(payload.authorId, userId)
    const message: ChatMessageData = {
      message: payload.text,
      self: payload.authorId === userId,
      authorId: payload.authorId,
      profilePicture: payload.profilePicture,
      userName: payload.userName,
    };

    setMessages((messages) => [...messages, message]);
  };

  useEffect(() => {
    if (chatSocket == null)
      return

    const setupConnection = async (payload: any) => {
      try {
        const response = await axios.get(API_ROUTES.COMPLETE_ROOM, { withCredentials: true });

        dispatch(addChannel(transformToChannelData(response.data)))
        dispatch(setUserActiveChannel(payload.currentRoom))

        const messages: ChatMessageData[] = response.data.messages.reduce(
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

        setMessages(messages)
      } catch (error) {
        console.error("There was an error fetching the data", error);
      }
    };

    chatSocket.on(ChatSocketEventType.JOIN_ROOM, setupConnection)
    chatSocket.on(ChatSocketEventType.MESSAGE, onNewMessage)

    return () => {
      if (chatSocket == null)
        return

      chatSocket.off(ChatSocketEventType.JOIN_ROOM)
      chatSocket.off(ChatSocketEventType.MESSAGE)
    }
  }, [chatSocket])

  useEffect(() => {

  }, [activeChannelName])


  const sendData = (data: string) => {
    let payload = null

    switch (data) {
      case ChatSocketActionType.CREATE_CHANNEL:
        payload = {
          action: "createRoom",
          roomName: "roomOne", // Needs some modifications
          password: ""
        }
        break;
      case ChatSocketActionType.SWITCH_CHANNEL:
        payload = {
          action: "joinRoom",
          roomName: "general",
          password: ""
        }
        break;

      default:
        chatSocket?.emit(ChatSocketEventType.MESSAGE, { message: data, roomName: activeChannelName });
        return;
    }

    chatSocket?.emit(ChatSocketEventType.CHAT_ACTION, payload)
  };

  const togglerTransition = {
    height: chatToggled ? "50vh" : "0vh",
  };

  return (
    <div className="chat-container">
      <div className="toggler" style={togglerTransition}>
        <ChatMetadata />
        <ChatContainer messagesReceived={messages} />
      </div>

      <ChatBar chatToggled={chatToggled} setChatToggled={setChatToggled} sendData={sendData} />
    </div>
  );
};
