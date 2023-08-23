import React from "react";

import PublicIcon from "../../../../../assets/globe.png"
import PrivateIcon from "../../../../../assets/private.png"
import ProtectedIcon from "../../../../../assets/padlock.png"

import Popup from "../../../utils/Popup"
import { Channel, ChannelType, ChannelData } from "../../../models/Channel";

interface ChannelListProps {
  channels: ChannelData[];
}

const ChannelList: React.FC<ChannelListProps> = ({ channels }) => {
  const getIconFromType = (type: ChannelType) => {
    let iconSrc = PublicIcon;

    if (type === ChannelType.PROTECTED)
      iconSrc = ProtectedIcon;
    else if (type === ChannelType.PRIVATE)
      iconSrc = PrivateIcon;

    return (<img alt="Channel Type" src={iconSrc} />)
  }

  const joinChannel = () => {

  }

  return (
    <div className="channel-list">
      {channels.map((channelData, index) => (
        <div className="channel-container" onClick={joinChannel}>

          <div key={index} className="channel">
            <div className="type-picture">
              {getIconFromType(channelData.type)}
            </div>

            <div className="channel-info">
              <p>{channelData.name}</p>
              <p>User Count: {channelData.users?.length || 0}</p>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
};

interface ChannelListPopupProps {
  channels: Channel[]
}

export default function ChannelListPopup( {channels}: ChannelListPopupProps ) {
  return (
    <Popup className="channel-list-popup">
      <ChannelList channels={channels.map(channel => channel.channelData)} />
    </Popup>
  )
}
