import React from "react";

const ChatMessage = ({ messages }) => {
  return (
    <div>
      {messages.map((message, index) =>
        <div className="message" key={index}>{message}</div>
      )}
    </div>
  )
}

export default ChatMessage