import { useState } from "react";

import PublicIcon from "../assets/globe.png"
import ProtectedIcon from "../assets/padlock.png"
import PrivateIcon from "../assets/private.png"

import MorePopup from "./more/MorePopup";
import ChannelManager from "./channel_manager/ChannelManager";
import { Channel, ChannelType } from "../models/Channel";
import OutsideClickHandler from "../utils/OutsideClickHandler";

export enum PopupType {
  CHANNEL = "channel",
  ALL_USERS = "all users",
  CHANNEL_LIST = "channel list",
}

export default function ChatMetadata() {
  const [isMoreActive, setIsMoreActive] = useState(false)
  const [popupType, setPopupActive] = useState<PopupType | null>(null)

  const channels: Channel[] = [
    new Channel({
      type: ChannelType.PUBLIC,
      name: "Public Channel",
      password: null,
      users: [],
      owner: null,
      admins: [],
      punishments: [],
    }),
    new Channel({
      type: ChannelType.PRIVATE,
      name: "Les boss",
      password: null,
      users: [],
      owner: null,
      admins: [],
      punishments: [],
    }),
    new Channel({
      type: ChannelType.PROTECTED,
      name: "Protected Channel",
      password: "examplePassword",
      users: [],
      owner: null,
      admins: [],
      punishments: [],
    }),
    new Channel({
      type: ChannelType.PUBLIC,
      name: "Another Public Channel",
      password: null,
      users: [],
      owner: null,
      admins: [],
      punishments: [],
    }),
    new Channel({
      type: ChannelType.PUBLIC,
      name: "Public Channel",
      password: null,
      users: [],
      owner: null,
      admins: [],
      punishments: [],
    }),
    new Channel({
      type: ChannelType.PRIVATE,
      name: "Les boss",
      password: null,
      users: [],
      owner: null,
      admins: [],
      punishments: [],
    }),
    new Channel({
      type: ChannelType.PROTECTED,
      name: "Protected Channel",
      password: "examplePassword",
      users: [],
      owner: null,
      admins: [],
      punishments: [],
    }),
    new Channel({
      type: ChannelType.PUBLIC,
      name: "Another Public Channel",
      password: null,
      users: [],
      owner: null,
      admins: [],
      punishments: [],
    }),
  ];

  const activeChannel: Channel = channels[0]

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
          <MorePopup popupType={popupType} setPopupActive={setPopupActive} channels={channels} />
        )}
      </OutsideClickHandler>

      <div className="channel-manager">
        <ChannelManager channel={activeChannel} />
      </div>

      <div className="channel-icon">
        {getIconFromType(activeChannel.channelData.type)}
      </div>
    </div>
  );
}
