import React from "react";

import TextInput from "./TextInput";

interface ChatBarProps {
  chatToggled: boolean;
}

const ChatBar: React.FC<ChatBarProps> = ({ chatToggled }) => {

  return (
    <div className="chatbar-container">
      <div className="text">{chatToggled && <TextInput />}</div>
    </div>
  );
};

export default ChatBar;
