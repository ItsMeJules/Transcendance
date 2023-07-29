import React, { useState } from "react";

import ChatMessage from "./ChatMessage";

const ChatContainer = ({ chatToggled, messagesReceived }) => {
  const style = {
    transition: "height 1s ease",
    height: chatToggled ? "50vh" : "0vh",
  }

  return (
    <div className="messages-container" style={style}>
      <ChatMessage messagesReceived={messagesReceived} />
    </div>
  )
}

export default ChatContainer