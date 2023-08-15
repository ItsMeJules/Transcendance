import React, { useRef, useEffect } from "react";

import ChatMessage from "./ChatMessage";

const ChatContainer = ({ messagesReceived }) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messagesReceived]);

  return (
    <div className="messages-container">
      <ChatMessage messagesReceived={messagesReceived} />
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatContainer