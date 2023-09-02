import { useState } from "react";

import { useAppSelector } from "utils/redux/Store";
import { ChannelType, transformToChannelData } from "../models/Channel";
import OutsideClickHandler from "../utils/OutsideClickHandler";
import ChannelManager from "./channel_manager/ChannelManager";
import MorePopup from "./more/MorePopup";

export enum PopupType {
  CHANNEL = "channel",
  ALL_USERS = "all users",
  CHANNEL_LIST = "channel list",
}

interface ChatMetadataProps {
  chatToggled: boolean;
}

export default function ChatMetadata({ chatToggled }: ChatMetadataProps) {
  const [isMoreActive, setIsMoreActive] = useState(false)
  const [popupType, setPopupActive] = useState<PopupType | null>(null)

  const activeChannel = transformToChannelData(useAppSelector(store => store.channels.activeChannel))

  const handleMoreClick = () => {
    if (!isMoreActive)
      setPopupActive(null);

    setIsMoreActive(prev => !prev);
  };

  const handleOutsideClick = () => {
    setIsMoreActive(false)
    setPopupActive(null)
  }

  const getIconFromType = (type: ChannelType) => {
    let iconSrc = "/images/globe.png";
    if (type === ChannelType.PROTECTED)
      iconSrc = "/images/padlock.png";
    else if (type === ChannelType.PRIVATE)
      iconSrc = "/images/private.png";

    return (<img alt="Channel Type" src={iconSrc} />)
  }

  return (
    <div className="metadata-container" style={{ zIndex: chatToggled ? 2 : 0 }}>
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
        {activeChannel
          ? <ChannelManager channelData={activeChannel} />
          : undefined}
      </div>

      <div className="channel-icon">
        {activeChannel ? getIconFromType(activeChannel.type) : undefined}
      </div>
    </div>
  );
}
