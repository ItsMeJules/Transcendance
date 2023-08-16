import React from "react";

interface Message {
  clientId: string;
  self: boolean;
}

interface ChatMessageProps {
  messagesReceived: Message[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({ messagesReceived }) => {
  return (
    <>
      {messagesReceived.map((message, index) => (
        <div
          className={"message-" + (message.self ? "self" : "other")}
          key={index}
        >
          {message.self}
        </div>
      ))}
    </>
  );
};

export default ChatMessage;
