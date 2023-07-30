import React from "react";

import UpArrow from "../../../assets/up-arrow.png"

import TextInput from "./TextInput";

const ChatBar = ({ toggleChat, chatToggled, sendData }) => {

  const arrowStyle = {
    transition: "transform 1s ease",
    transform: (chatToggled ? "rotate(180deg)" : "")
  }

  return (
    <div className="chatbar-container">
      <div className="text">
        {chatToggled && <TextInput sendData={sendData} />}
      </div>

      <div className="toggler">
        <img
          className="arrow-img"
          alt="Up-Arrow"
          src={UpArrow}
          style={arrowStyle}
          onClick={() => toggleChat()}
        />
      </div>
    </div>
  )
}

export default ChatBar