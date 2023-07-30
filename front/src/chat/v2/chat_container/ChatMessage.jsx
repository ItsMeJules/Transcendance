import React from "react";

const ChatMessage = ({ messagesReceived }) => {
  return (
    <>
      {messagesReceived.map((message, index) =>
        <div className={"message-" + (message.self ? "self" : "other")}>{message.data}</div>
      )}
    </>
  )
}

export default ChatMessage