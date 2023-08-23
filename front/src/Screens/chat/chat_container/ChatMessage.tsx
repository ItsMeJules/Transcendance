import React from "react";

interface Message {
  message: string;
  self: boolean;
}

interface ChatMessageProps {
  messagesReceived: Message[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({ messagesReceived }) => {
  return (
    <>
      {messagesReceived.map((message, index) => {
        return (
          <div
            className={"message-" + (message.self ? "self" : "other")}
            key={index}
          >
            {message.message}
          </div>
        );
      })}
    </>
  );
};

export default ChatMessage;
