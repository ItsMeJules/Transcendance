import React from "react";

import { Channel, ChannelData } from "../../../../Services/Channel";
import Settings from "../../assets/settings.png";

interface ChannelManagerProps {
  channel: Channel;
}

export default function ChannelManager(props: ChannelManagerProps) {
  const data: ChannelData | null = props.channel.channelData

  return (
    <>
      <div className="channel-name">
        {data?.name}
      </div>

      <div className="users-list">
        {data?.users?.length}
      </div>

      <div className="manage">
        <img
          alt="Settings"
          src={Settings} />
      </div>
    </>
  )
}