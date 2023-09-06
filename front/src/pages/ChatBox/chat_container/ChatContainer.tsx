import React, { useEffect, useRef } from "react";

import { useWebsocketContext } from "services/Websocket/Websocket";
import { useAppDispatch, useAppSelector } from "utils/redux/Store";
import { addMessageToActiveChannel } from "utils/redux/reducers/ChannelSlice";
import { ChannelMessageData } from "../models/Channel";
import { ChatMessageData } from "../models/ChatMessageData";
import { ChatSocketEventType } from "../models/TypesActionsEvents";
import ChatMessage from "./ChatMessage";

const ChatContainer: React.FC = () => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const chatSocket = useWebsocketContext().chat;
  const dispatch = useAppDispatch();
  const { id: userId, currentRoom: activeChannelName, blockedUsers } = useAppSelector(
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
      blocked: blockedUsers.some(id => id === message.authorId),
    });
    return chatMessages;
  }, []);

  useEffect(() => {
    chatSocket?.on(ChatSocketEventType.MESSAGE, (payload: any) => {
      if (activeChannelName === null) return;

      dispatch(addMessageToActiveChannel(payload));
    });

    return () => {
      chatSocket?.off(ChatSocketEventType.MESSAGE);
    };
  }, [chatSocket, userId, activeChannelName, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
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
