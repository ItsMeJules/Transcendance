import React, { useState } from "react";

import ChatMessage from "./ChatMessage";

const ChatContainer = ({ messagesReceived }) => {
  return (
    <div className="messages-container">
      <ChatMessage messagesReceived={messagesReceived} />
    </div>
  )
}

export default ChatContainer