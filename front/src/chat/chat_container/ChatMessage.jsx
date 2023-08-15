import React from "react";

const ChatMessage = ({ messagesReceived }) => {
  return (
    <>
      {messagesReceived.map((message, index) => (
        <div
          className={"message-" + (message.self ? "self" : "other")}
          key={index}
        >
          {message.data}
        </div>
      ))}
    </>
  );
};

export default ChatMessage;
