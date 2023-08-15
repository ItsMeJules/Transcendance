import React, { useState } from "react";

import MorePopup from "./more/MorePopup";


export default function ChatMetadata() {
  const [isMoreActive, setIsMoreActive] = useState(false);
  const [channelPopup, setChannelPopup] = useState(false)

  const handleMoreClick = (event) => {
    if (!isMoreActive == false)
      setChannelPopup(false) 

    setIsMoreActive(!isMoreActive);
  }

  return (
    <div className="metadata-container">
      <div className="more" onClick={handleMoreClick}>

        <div className={"more-symbol " + (isMoreActive ? "active" : "")}>
          <span></span> {/* Useful for the more symbol animation */}
        </div>

        {isMoreActive && <MorePopup channelPopup={channelPopup} setChannelPopup={setChannelPopup}/>}

      </div>

      <div className="metadata">
        <div className="chat-info"></div>
        <div className="chat-icon"></div>
      </div>
    </div>
  );
}