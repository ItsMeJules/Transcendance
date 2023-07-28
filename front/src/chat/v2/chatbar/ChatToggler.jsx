import React from "react";

import UpArrow from "../../../assets/up-arrow.png"

import TextInput from "./TextInput";

const ChatToggler = ({setChatToggled, chatToggled, sendData}) => {
  
  const arrowStyle = {
    transition: "transform 1s ease",
    transform: (chatToggled ? "rotate(180deg)" : "")
  }

	return (
		<div className="toggler-container">
        <div className="text">
          <TextInput sendData={sendData} />
        </div>
        
        <div className="toggler">
          <img
            className="arrow-img"
            alt="Up-Arrow"
            src={UpArrow}
            style={arrowStyle}
            onClick={() => setChatToggled(!chatToggled)}
          />
        </div>

      </div>
	)
}

export default ChatToggler