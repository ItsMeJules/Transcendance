import React, { useState, useEffect, useRef } from "react";
import { io } from 'socket.io-client';

import "./ChatBox.scss"

import ChatBar from "./chatbar/ChatBar";
import ChatContainer from "./chat_container/ChatContainer";
import ChatMetadata from "./metadata/ChatMetadata";

export default function ChatBox() {
  const [chatToggled, setChatToggled] = useState(false)
  const [messages, setMessages] = useState([])
  const socketRef = useRef(null);

  const onNewMessage = (message) => {
    if (socketRef.current) {
      message.self = message.clientId === socketRef.current.id;
      setMessages(messages => [...messages, message]);
    }
  }

  useEffect(() => {
    socketRef.current = io("http://localhost:3000");

    socketRef.current.on("connect", () => {
      socketRef.current.on("message", onNewMessage);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.off("message", onNewMessage);
        socketRef.current.disconnect();
      }
    };
  }, []);

  const sendData = (data) => {
    if (socketRef.current)
      socketRef.current.emit("message", data);
  }

  const style = {
    height: chatToggled ? "50vh" : "0vh",
  }

  return (
    <div className="chat-container">
      <div className="toggler" style={style}>
        <ChatMetadata />
        <ChatContainer messagesReceived={messages} />
      </div>
      
      <ChatBar
        chatToggled={chatToggled}
        setChatToggled={setChatToggled}
        sendData={sendData}
      />
    </div>
  )
}
