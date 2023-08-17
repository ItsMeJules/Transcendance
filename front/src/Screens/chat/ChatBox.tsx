import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

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
    console.log(
      "new message: ",
      payload,
      "socketrefId : ",
      socketRef.current?.id,
      "payload.clientId : ",
      payload.clientId
    );
    let message: Message = payload;
    message.self = payload.clientId === socketRef.current?.id;
    setMessages((messages) => [...messages, message]);
  };

  useEffect(() => {
    socketRef.current = socket.chat;

    const handleReconnect = () => {
      console.log("Reconnected to server. Resetting event listeners.");
      socketRef.current?.off("message");
      socketRef.current?.on("message", onNewMessage);
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
      console.log("emitting the data: ", data);
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
