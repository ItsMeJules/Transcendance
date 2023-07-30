import React, { useState } from "react";

import ChatMessage from "./ChatMessage";

const ChatContainer = ({ messagesReceived, hideMessages }) => {
  return (
    <div className="messages-container">
      {!hideMessages && <ChatMessage messagesReceived={messagesReceived} />}
    </div>
  )
}

export default ChatContainer