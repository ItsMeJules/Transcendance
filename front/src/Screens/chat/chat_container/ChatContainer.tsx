import React, { useRef, useEffect } from "react";

import ChatMessage from "./ChatMessage";

interface Message {
  message: string;
  self: boolean;
}

interface ChatContainerProps {
  messagesReceived: Message[];
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messagesReceived }) => {
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesReceived]);

  return (
    <div className="messages-container">
      <ChatMessage messagesReceived={messagesReceived} />
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;
