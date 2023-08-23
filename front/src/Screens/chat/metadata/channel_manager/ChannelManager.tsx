import React, { useState } from "react";

import { Channel, ChannelData } from "../../models/Channel";

import Settings from "../../assets/settings.png";
import ManageChannelPopup from "./popups/ManageChannelPopup";

interface ChannelManagerProps {
  channel: Channel;
}

export default function ChannelManager(props: ChannelManagerProps) {
  const [manageChannel, setManageChannel] = useState<boolean>(false);
  const { channel }: ChannelManagerProps = props;

  return (
    <>
      <div className="text">
        <div className="channel-name">
          {channel.channelData.name}
        </div>

        <div className="users-list">
          {channel.channelData.users?.length}
        </div>
      </div>

      <div className="manage">
        <img
          alt="Settings"
          src={Settings}
          onClick={() => setManageChannel(!manageChannel)} />

        {manageChannel && <ManageChannelPopup channel={channel}/>}
      </div>

    </>
  )
}