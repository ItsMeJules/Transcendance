import React from "react";

import TextInput from "./TextInput";

interface ChatBarProps {
  setChatToggled: (toggled: boolean) => void;
  chatToggled: boolean;
}

const ChatBar: React.FC<ChatBarProps> = ({ setChatToggled, chatToggled }) => {
  const arrowStyle = {
    transition: "transform 1s ease",
    transform: chatToggled ? "rotate(180deg)" : "",
  };

  return (
    <div className="chatbar-container">
      <div className="text">{chatToggled && <TextInput />}</div>

      <div className="toggler">
        <img
          className="arrow-img"
          alt="Up-Arrow"
          src="/images/up-arrow.png"
          style={arrowStyle}
          onClick={() => setChatToggled(!chatToggled)}
        />
      </div>
    </div>
  );
};

export default ChatBar;
