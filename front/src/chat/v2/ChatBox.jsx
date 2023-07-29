import React, { useState, useEffect } from "react";
import { io } from 'socket.io-client';

import "./ChatBox.scss"

import ChatBar from "./chatbar/ChatBar";
import ChatContainer from "./chat_container/ChatContainer";
import ChatMetadata from "./metadata/ChatMetadata";

export default function ChatBox() {
  const [chatToggled, setChatToggled] = useState(false)
  const [messages, setMessages] = useState([])
  const [socket, setSocket] = useState(null);

  const onNewMessage = (message) => {
    setMessages(messages => [...messages, message]);
  }

  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);

    newSocket.on("message", onNewMessage);

    return () => {
      if (newSocket) {
        newSocket.off("message", onNewMessage);
        newSocket.disconnect();
      }
    };
  }, []);

  const sendData = (data) => {
    if (socket)
      socket.emit("message", data);
  }

  return (
    <div className="chat-container">
      <ChatMetadata />
      <ChatContainer
        messages={messages}
        chatToggled={chatToggled}
      />
      <ChatBar
        chatToggled={chatToggled}
        setChatToggled={setChatToggled}
        sendData={sendData}
      />
    </div>
  )
}