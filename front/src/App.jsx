import React, { useState } from 'react';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

import './App.css';

import MessageInput from './chat/MessageInput';
import Messages from './chat/Messages';

function App() {
  const [socket, setSocket] = useState()
  const [messages, setMessages] = useState([])

  const send = (data) => { socket.emit("message", data) }

  useEffect(() => {
    const newSocket = io('http://localhost:3000')
    setSocket(newSocket)

    return () => {
      newSocket.disconnect();
    }
  }, [setSocket])

  useEffect(() => {
    const messageListener = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    if (socket) {
      socket.on("message", messageListener);
    }

    return () => {
      if (socket) {
        socket.off("message", messageListener);
      }
    };
  }, [socket]);

  return (
    <div>
      <h1>Chat en temps réel</h1>
      <MessageInput send={send}/>
      <Messages messages={messages}/>
    </div>
  );
}

export default App;