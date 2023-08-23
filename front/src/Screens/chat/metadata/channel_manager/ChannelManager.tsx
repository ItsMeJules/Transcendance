import React, { useState } from "react";

import SettingsIcon from "../../assets/settings.png";
import PublicIcon from "../../assets/globe.png"
import ProtectedIcon from "../../assets/padlock.png"
import PrivateIcon from "../../assets/private.png"

import { Channel, ChannelData, ChannelType } from "../../models/Channel";
import ManageChannelPopup from "./popups/ManageChannelPopup";

interface ChannelManagerProps {
  channel: Channel;
}

export default function ChannelManager(props: ChannelManagerProps) {
  const [manageChannel, setManageChannel] = useState<boolean>(false);
  const { channel }: ChannelManagerProps = props;

  const manageStyle = {
    transition: "transform 1s ease",
    transform: manageChannel ? "rotate(90deg)" : "",
  };

  const getIconFromType = (type: ChannelType) => {
    let iconSrc = PublicIcon;

    if (type === ChannelType.PROTECTED)
      iconSrc = ProtectedIcon;
    else if (type === ChannelType.PRIVATE)
      iconSrc = PrivateIcon;

    return (<img alt="Channel Type" src={iconSrc} />)
  }

  return (
    <>
      <div className="channel-infos">
        <div className="channel-info-container">
          <div className="channel-name">
            {channel.channelData.name}
          </div>
          <div className="icon-type">
            {getIconFromType(channel.channelData.type)}
          </div>
        </div>

        <div className="users-list">
          {channel.channelData.users?.length}
        </div>
      </div>

      <div className="manage">
        <img
          alt="Settings"
          src={SettingsIcon}
          style={manageStyle}
          onClick={() => setManageChannel(!manageChannel)} />

        {manageChannel && <ManageChannelPopup channel={channel} />}
      </div>

    </>
  )
}