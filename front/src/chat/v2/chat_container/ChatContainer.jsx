import React, { useState } from "react";

import ChatMessage from "./ChatMessage";

const ChatContainer = ({ chatToggled, messages }) => {
  const style = {
    transition: "height 1s ease",
    height: chatToggled ? "50vh" : "0vh",
  }

  return (
    <div className="messages-container" style={style}>
      <ChatMessage messages={messages} />
    </div>
  )
}

export default ChatContainer