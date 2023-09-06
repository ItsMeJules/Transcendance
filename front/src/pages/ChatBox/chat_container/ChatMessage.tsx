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
              <img src={message.blocked ? BlockedImg : message.profilePicture} alt="Profile" />
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
