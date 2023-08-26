import { useEffect, useState } from "react";

import PublicIcon from "../assets/globe.png"
import ProtectedIcon from "../assets/padlock.png"
import PrivateIcon from "../assets/private.png"

import MorePopup from "./more/MorePopup";
import ChannelManager from "./channel_manager/ChannelManager";
import { Channel, ChannelData, ChannelType } from "../models/Channel";
import OutsideClickHandler from "../utils/OutsideClickHandler";
import { useAppSelector } from "../../../redux/Store";
import { findChannelByName } from "../../../redux/reducers/ChannelSlice";

export enum PopupType {
  CHANNEL = "channel",
  ALL_USERS = "all users",
  CHANNEL_LIST = "channel list",
}

export default function ChatMetadata() {
  const [isMoreActive, setIsMoreActive] = useState(false)
  const [popupType, setPopupActive] = useState<PopupType | null>(null)

  const activeChannelName = useAppSelector(store => store.user.userData.currentRoom)
  const activeChannel: ChannelData | undefined = useAppSelector(store => {
    if (activeChannelName === null)
      return

    const channel = findChannelByName(store.channels, activeChannelName)
    if (channel)
      return channel
    return 
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

  const getIconFromType = (type: ChannelType) => {
    let iconSrc = PublicIcon;

    if (type === ChannelType.PROTECTED)
      iconSrc = ProtectedIcon;
    else if (type === ChannelType.PRIVATE)
      iconSrc = PrivateIcon;

    return (<img alt="Channel Type" src={iconSrc} />)
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
        <ChannelManager channelData={activeChannel} />
      </div>

      <div className="channel-icon">
        {activeChannel ? getIconFromType(activeChannel.type) : undefined}
      </div>
    </div>
  );
}
