import React, { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { eventNames } from "process";
import "./ChatBox.scss";
import ChatBar from "./chatbar/ChatBar";
import ChatContainer from "./chat_container/ChatContainer";
import ChatMetadata from "./metadata/ChatMetadata";
import { useWebsocketContext } from "../../Wrappers/Websocket";
import axios from "axios";
import { API_ROUTES } from "../../Utils";

interface Message {
  message: string;
  self: boolean;
}

export const ChatBox = () => {
  const [chatToggled, setChatToggled] = useState<boolean>(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [roomName, setRoomName] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const socket = useWebsocketContext();
  socketRef.current = socket.chat;

  useEffect(() => {
    const fetchRoomName = async () => {
      try {
        const response = await axios.get(API_ROUTES.CURRENT_CHAT, {
          withCredentials: true,
        });
        console.log("response :", response);
        setRoomName(response.data);
      } catch (error) {
        console.error("There was an error fetching the data", error);
      }
    };

    fetchRoomName();
  }, []);

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
    console.log("roomName : ", roomName);
    if (!roomName) {
      return;
    }
    console.log("Setting current to :", socket.chat);
    socketRef.current = socket.chat;
    
    const handleReconnect = () => {
      console.log("roomName is : ", roomName, " socket id : ", socketRef.current);
      const fetchRoomForUser = "load_chat_" + roomName;
      socketRef.current?.off("message");
      socketRef.current?.on("message", onNewMessage);
      socketRef.current?.on(fetchRoomForUser, (payload: any) => {
        payload.forEach((msg: any) => {
          onNewMessage({
            message: msg.text,
            authorId: msg.authorId,
            clientId: msg.clientId,
            ...msg, // ADD MESSAGE INTERFACE
          });
        });
      });
      socketRef.current?.emit("chat-action", {
        action: "createRoom",
        roomName: roomName,
        password: "", // fetch information on the reset off the channel
      });
    };

    socketRef.current?.on("connect", handleReconnect);

    socketRef.current?.on("connection", (payload: any) => {
      console.log("user " + (payload.connected ? "connected" : "disconnected") + ": ", payload)
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.off("message", onNewMessage);
        socketRef.current.off("connect", handleReconnect);
        socketRef.current.off("connection")
        socketRef.current.disconnect();
      }
    };
  }, [socket, roomName]);

  const sendData = (data: string) => {
    console.log("roomName is : ", roomName);
    if (socketRef.current) {
      if (data === "create_channel") {
        setRoomName("roomOne");
        socketRef.current.emit("chat-action", {
          action: "createRoom",
          roomName: "roomOne",
          password: "",
        });
        console.log("room is now :", roomName);
      } else if (data === "change_channel") {
        setRoomName("roomOne");
        socketRef.current.emit("chat-action", {
          action: "joinRoom",
          roomName: "roomOne",
          password: "",
        });
        console.log("room is now :", roomName);
      } else if (data === "change_channel_pub") {
        setRoomName("general");
        socketRef.current.emit("chat-action", {
          action: "joinRoom",
          roomName: "general",
          password: "",
        });
        console.log("room is now :", roomName);
      } else if (data === "block") {
        socketRef.current.emit("chat-action", {
          action: "block",
          roomName: "rooo",
        });
      } else if (data === "block") {
        socketRef.current.emit("chat-action", {
          action: "block",
          targetId: 2,
        });
      } else {
        console.log("sending data: ", data, " on roomName : ", roomName);
        socketRef.current.emit("message", { message: data, roomName: roomName });
      }
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

      <ChatBar chatToggled={chatToggled} setChatToggled={setChatToggled} sendData={sendData} />
    </div>
  );
};
