import React, { useState } from "react";

import MorePopup from "./more/MorePopup";
import ChannelManager from "./channel_manager/ChannelManager";
import { Channel, ChannelData, ChannelType } from "../models/Channel";
import OutsideClickHandler from "../utils/OutsideClickHandler";

export enum PopupType {
  CHANNEL = "channel",
  DIRECT_MESSAGE = "direct message",
  RESTRICT = "restrict user",
  CHANNEL_LIST = "channel list",
}

export default function ChatMetadata() {
  const [isMoreActive, setIsMoreActive] = useState(false)
  const [popupType, setPopupActive] = useState<PopupType | null>(null)

  const activeChannel: Channel = new Channel({
    type: ChannelType.PUBLIC,
    name: "Public",
    password: null,
    users: [],
    owner: null,
    admins: [],
    punishments: []
  })

  const handleMoreClick = () => {
    if (!isMoreActive)
      setPopupActive(null);

    setIsMoreActive(prev => !prev);
  };

  const handleOutsideClick = () => {
    setIsMoreActive(false)
    setPopupActive(null)
  }

  return (
    <div className="metadata-container">
      <OutsideClickHandler className="more" onInsideClick={handleMoreClick} onOutsideClick={handleOutsideClick}>
        <div className="more-symbol-container">
          <div className={"more-symbol " + (isMoreActive ? "active" : "")}>
            <span></span> {/* Useful for the more symbol animation */}
          </div>
        </div>

        {isMoreActive && (
          <MorePopup popupType={popupType} setPopupActive={setPopupActive} />
        )}
      </OutsideClickHandler>

      <div className="channel-manager">
        <ChannelManager channel={activeChannel} />
      </div>

      <div className="channel-icon"></div>
    </div>
  );
}
