import React, { useState } from "react";

import MorePopup from "./more/MorePopup";

export const PopupType = {
  CHANNEL: "channel",
  DIRECT_MESSAGE: "direct message",
  RESTRICT: "restrict user",
  CHANNEL_LIST: "channel list"
}

export default function ChatMetadata() {
  const [isMoreActive, setIsMoreActive] = useState(false);
  const [popupType, setPopupActive] = useState(null)

  const handleMoreClick = (event) => {
    if (!isMoreActive === false)
      setPopupActive(null)

    setIsMoreActive(!isMoreActive);
  }

  return (
    <div className="metadata-container">
      <div className="more" onClick={handleMoreClick}>

        <div className={"more-symbol " + (isMoreActive ? "active" : "")}>
          <span></span> {/* Useful for the more symbol animation */}
        </div>

        {isMoreActive &&
          <MorePopup popupType={popupType} setPopupActive={setPopupActive}/>
        }

      </div>

      <div className="metadata">
        <div className="chat-info"></div>
        <div className="chat-icon"></div>
      </div>
    </div>
  );
}