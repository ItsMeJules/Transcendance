import React from "react";

import UpArrow from "../../assets/up-arrow.png"
import RightArrow from "../../assets/right-arrow.png"

import "./ChatBox.scss"

export default function ChatBox() {


	return (
		<div className="chat-container">
      
      <div className="metadata-container">
        <div className="metadata"></div>
      </div>

      <div className="messages-container">
        <div className="message"></div>
      </div>

      <div className="toggler-container">
        <div className="text">

          <div className="text-input">
            <input placeholder="Ecrivez un message.." />

            <div className="text-send">
              <img
                className="arrow-img"
                alt="Send"
                src={RightArrow}
              />

            </div>

          </div>
        </div>
        
        <div className="toggler">
          <img
            className="arrow-img"
            alt="Up-Arrow"
            src={UpArrow}
          />
        </div>

      </div>
      
		</div>
	)
}