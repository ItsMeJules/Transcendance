import React, { useEffect, useRef } from "react";

import { useWebsocketContext } from "../../../Wrappers/Websocket";
import { useAppDispatch, useAppSelector } from "../../../redux/Store";
import { addMessageToActiveChannel } from "../../../redux/reducers/ChannelSlice";
import {
  ChatSocketActionType,
  ChatSocketEventType,
  RoomSocketActionType,
} from "../models/TypesActionsEvents";
import { ChannelMessageData } from "../models/Channel";
import { ChatMessageData } from "../models/ChatMessageData";
import ChatMessage from "./ChatMessage";

const ChatContainer: React.FC = () => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const chatSocket = useWebsocketContext().chat;
  const dispatch = useAppDispatch();
  const { id: userId, currentRoom: activeChannelName } = useAppSelector(
    (store) => store.user.userData
  );

  const messages: ChannelMessageData[] | undefined = useAppSelector(
    (store) => store.channels.activeChannel?.messages
  );
  const chatMessages = messages?.reduce((chatMessages: ChatMessageData[], message: any) => {
    chatMessages.push({
      message: message.text,
      self: message.authorId === userId,
      authorId: message.authorId,
      profilePicture: message.profilePicture,
      userName: message.userName,
    });

    return chatMessages;
  }, []);

  useEffect(() => {
    const onNewMessage = (payload: any) => {
      if (activeChannelName === null) return;

      dispatch(addMessageToActiveChannel(payload));
    };

    chatSocket?.on(ChatSocketEventType.MESSAGE, onNewMessage);

    return () => {
      chatSocket?.off(ChatSocketEventType.MESSAGE);
    };
  }, [chatSocket, userId, activeChannelName, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages-container">
      {chatMessages !== undefined ? (
        <ChatMessage messagesReceived={chatMessages} />
      ) : undefined}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;
