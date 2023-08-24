import React from "react";

interface Message {
  message: string;
  self: boolean;
  authorId: number;
  profilePicture: string;
  userName: string;
}

interface ChatMessageProps {
  messagesReceived: Message[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({ messagesReceived }) => {
  let previousMessageSender: number | null = null;

  return (
    <>
      {messagesReceived.map((message, index) => {
        const isSameSender = message.authorId === previousMessageSender;
        previousMessageSender = message.authorId;

        const messageClassName = "message-" + (message.self ? "self" : "other");

        return (
          <div className="message-container">
            {!isSameSender && !message.self ? <img src={message.profilePicture} /> : null}
            <div className={messageClassName} key={index}>
              <p>{message.message}</p>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ChatMessage;
