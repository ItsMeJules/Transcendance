import React from "react";

import { ChatMessageData } from "../models/ChatMessageData";

interface ChatMessageProps {
  messagesReceived: ChatMessageData[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({ messagesReceived }) => {
  let BlockedImg = require("../assets/blocked.png");
  let previousMessageSender: number | null = null;

  return (
    <>
      {messagesReceived.map((message, index) => {
        const isSameSender = message.authorId === previousMessageSender;
        previousMessageSender = message.authorId;

        const messageClassName = "message-" + (message.self ? "self" : "other");

        return (
          <div className="message-container" key={index}>
            {!isSameSender && !message.self ? (
            <div className="profile-details">
              <img src={message.blocked ? BlockedImg : message.profilePicture} alt="Profile" />
              <p className="username">{message.blocked ? "User blocked" : message.userName}</p>
            </div>
            ) : undefined}
            <div className={messageClassName}>
              <p>{message.blocked ? "User blocked" : message.message}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ChatMessage;
