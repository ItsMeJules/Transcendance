import React, { useEffect, useRef } from "react";

import { useWebsocketContext } from "../../../Wrappers/Websocket";
import { useAppDispatch, useAppSelector } from "../../../redux/Store";
import { addMessage, findChannelByName } from "../../../redux/reducers/ChannelSlice";
import { ChatSocketEventType } from "../ChatBox";
import { ChannelMessageData } from "../models/Channel";
import { ChatMessageData } from "../models/ChatMessageData";
import ChatMessage from "./ChatMessage";

const ChatContainer: React.FC = () => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const chatSocket = useWebsocketContext().chat;
  const dispatch = useAppDispatch()
  const { id: userId, currentRoom: activeChannelName } = useAppSelector(store => store.user.userData)

  const messages: ChannelMessageData[] = useAppSelector(store => {
    if (activeChannelName === null)
      return []

    const channel = findChannelByName(store.channels, activeChannelName)
    if (channel)
      return channel.messages

    return []
  })
  let chatMessages = messages.reduce((chatMessages: ChatMessageData[], message: any) => {
    chatMessages.push({
      message: message.text,
      self: message.authorId === userId,
      authorId: message.authorId,
      profilePicture: message.profilePicture,
      userName: message.userName,
    })

    return chatMessages
  }, [])

  useEffect(() => {
    const onNewMessage = (payload: any) => {
      if (activeChannelName === null)
        return

      dispatch(addMessage({ channelName: activeChannelName, message: payload }))
    };

    chatSocket?.on(ChatSocketEventType.MESSAGE, onNewMessage)

    return () => {
      chatSocket?.off(ChatSocketEventType.MESSAGE)
    }
  }, [chatSocket, userId, activeChannelName, dispatch])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages-container">
      <ChatMessage messagesReceived={chatMessages} />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;
