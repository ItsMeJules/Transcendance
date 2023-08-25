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
import { useAxios } from "../../api/axios-config";
import { ChatMessageData } from "./models/ChatMessageData";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";

export const ChatBox = () => {
  const [chatToggled, setChatToggled] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessageData[]>([]);

  const [roomName, setRoomName] = useState<string | null>(null);
  const previousRoomName = useRef<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const roomNameRef = useRef<string | null>(null);
  const socket = useWebsocketContext();

  const onNewMessage = (payload: any) => {
    const userDataString = localStorage.getItem("userData");
    let userId;
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      userId = userData.id;
    }

    const message: ChatMessageData = {
      message: payload.text,
      self: payload.authorId === userId,
      authorId: payload.authorId,
      profilePicture: payload.profilePicture,
      userName: payload.userName,
    };

    setMessages((messages) => [...messages, message]);
  };

  useEffect(() => {
    const currentEventRoom = "load_chat_" + roomName;
    const previousEventRoom = "load_chat_" + previousRoomName.current;
    socketRef.current?.off(previousEventRoom);
    socketRef.current?.on(currentEventRoom, (payload: any) => {
      setMessages([]);
      payload.forEach((msg: any) => {
        onNewMessage({
          message: msg.text,
          authorId: msg.authorId,
          clientId: msg.clientId,
          ...msg, // ADD MESSAGE INTERFACE
        });
      });
    });
    previousRoomName.current = roomName;
    socketRef.current?.emit("chat-action", {
      action: "fetchHistory",
      roomName: roomName,
      password: "", //How to handle password ?
    });
  }, [roomName]);

  useEffect(() => {
    if (socket.chat === null) {
      return;
    }
    socketRef.current = socket.chat;

    const handleReconnect = async () => {
      try {
        const response = await axios.get(API_ROUTES.CURRENT_CHAT, {
          withCredentials: true,
        });
        setRoomName(response.data);
        previousRoomName.current = response.data;
      } catch (error) {
        console.error("There was an error fetching the data", error);
      }
      socketRef.current?.off("message");
      socketRef.current?.on("message", onNewMessage);
      socketRef.current?.on("joinRoom", (payload: any) => {
        setRoomName(payload);
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
      if (data === "create_channel") {
        socketRef.current.emit("chat-action", {
          action: "createRoom",
          roomName: "roomOne",
          password: "",
        });
      } else if (data === "change_channel") {
        socketRef.current.emit("chat-action", {
          action: "joinRoom",
          roomName: "roomOne",
          password: "",
        });
      } else if (data === "change_channel_pub") {
        socketRef.current.emit("chat-action", {
          action: "joinRoom",
          roomName: "general",
          password: "",
        });
      } else if (data === "fetch") {
        socketRef.current?.emit("chat-action", {
          action: "fetchHistory",
          roomName: roomName,
          password: "",
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
