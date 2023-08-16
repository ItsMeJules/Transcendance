import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

import "./ChatBox.scss";

import ChatBar from "./chatbar/ChatBar";
import ChatContainer from "./chat_container/ChatContainer";
import ChatMetadata from "./metadata/ChatMetadata";
import { useWebsocketContext } from "../../Wrappers/Websocket";

interface Message {
  clientId: string;
  self: boolean;
}

export const ChatBox = () => {
  const [chatToggled, setChatToggled] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const socket = useWebsocketContext();

  const onNewMessage = (payload: any) => {
    let message: Message = payload;
    message.self = message.clientId === socketRef.current?.id;
    setMessages((messages) => [...messages, message]);
  };

  const printPayload = (payload: any) => {
    console.log("lol", payload);
  };

  useEffect(() => {
    console.log(socket);
    socketRef.current = io("http://localhost:8000/chat");
    console.log(socketRef.current);
    socketRef.current?.on("chat", () => {
      socketRef.current?.on("message", printPayload);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("message", onNewMessage);
        socketRef.current.disconnect();
      }
    };
  }, [socket]);

  const sendData = (data: string) => {
    if (socketRef.current) {
      socketRef.current.emit("message", data);
      console.log("socketRef: ", socketRef.current);
      console.log("emitting the message data : ", data);
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
