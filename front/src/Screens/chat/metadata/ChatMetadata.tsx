import React, { useState, MouseEvent } from "react";

import MorePopup from "./more/MorePopup";
import ChannelManager from "./channel_manager/ChannelManager";
import { Channel, ChannelData, ChannelType } from "../../../Services/Channel";

export enum PopupType {
  CHANNEL = "channel",
  DIRECT_MESSAGE = "direct message",
  RESTRICT = "restrict user",
  CHANNEL_LIST = "channel list",
}

export default function ChatMetadata() {
  const [isMoreActive, setIsMoreActive] = useState(false);
  const [popupType, setPopupActive] = useState<PopupType | null>(null);
  const activeChannel: Channel = new Channel({
    type: ChannelType.PUBLIC,
    name: "Public",
    password: null,
    users: [],
    owner: null,
    admins: [],
    punishments: []
  })

  const handleMoreClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!isMoreActive) setPopupActive(null);

    setIsMoreActive(!isMoreActive);
  };

  return (
    <div className="metadata-container">
      <div className="more" onClick={handleMoreClick}>
        <div className="more-symbol-container">
          <div className={"more-symbol " + (isMoreActive ? "active" : "")}>
            <span></span> {/* Useful for the more symbol animation */}
          </div>
        </div>

        {isMoreActive && (
          <MorePopup popupType={popupType} setPopupActive={setPopupActive} />
        )}
      </div>

      <div className="channel-manager">
        <ChannelManager channel={activeChannel}/>
      </div>

      <div className="channel-icon"></div>
    </div>
  );
}
