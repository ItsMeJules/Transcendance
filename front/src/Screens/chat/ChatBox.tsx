import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { eventNames } from "process";
import "./ChatBox.scss";
import ChatBar from "./chatbar/ChatBar";
import ChatContainer from "./chat_container/ChatContainer";
import ChatMetadata from "./metadata/ChatMetadata";
import { useWebsocketContext } from "../../Wrappers/Websocket";

interface Message {
  message: string;
  self: boolean;
}

export const ChatBox = () => {
  const [chatToggled, setChatToggled] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const socket = useWebsocketContext();

  const onNewMessage = (payload: any) => {
    //////////// TEMPORARY FIX \\\\\\\\\\\\\\\\
    const userDataString = localStorage.getItem("userData");
    let userId;
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      userId = userData.id;
    }
    const message: Message = {
      message: payload.text,
      self: payload.authorId === userId,
    };
    setMessages((messages) => [...messages, message]);
  };

  useEffect(() => {
    socketRef.current = socket.chat;
    const handleReconnect = () => {
      //////////// TEMPORARY FIX \\\\\\\\\\\\\\\\
      const userDataString = localStorage.getItem("userData");
      let userData = null;
      if (userDataString) {
        userData = JSON.parse(userDataString);
      }
      const userId = userData.id;
      const eventNameSocket = "load_general_chat_" + userId;
      socketRef.current?.off("message");
      socketRef.current?.on("message", onNewMessage);
      socketRef.current?.on(eventNameSocket, (payload: any) => {
        payload.forEach((msg: any) => {
          onNewMessage({
            message: msg.text,
            authorId: msg.authorId,
            clientId: msg.clientId,
            ...msg,
          });
        });
      });
    };
    socketRef.current?.on("connect", handleReconnect);
    return () => {
      if (socketRef.current) {
        socketRef.current.off("message", onNewMessage);
        socketRef.current.off("connect", handleReconnect);
        socketRef.current.disconnect();
      }
    };
  }, [socket]);

  const sendData = (data: string) => {
    if (socketRef.current) {
      socketRef.current.emit("message", data);
    }
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

      <ChatBar
        chatToggled={chatToggled}
        setChatToggled={setChatToggled}
        sendData={sendData}
      />
    </div>
  );
};
