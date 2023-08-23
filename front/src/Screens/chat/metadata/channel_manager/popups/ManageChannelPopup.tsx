import React, { useState } from "react";

import Popup from "../../../utils/Popup";
import { Channel, ChannelType } from "../../../models/Channel";

interface ChannelPopupProps {
  channel: Channel
}

const ManageChannelPopup: React.FC<ChannelPopupProps> = ({ channel }: ChannelPopupProps) => {
  const [channelType, setChannelType] = useState(ChannelType.PUBLIC)
  const [channelPassword, setChannelPassword] = useState("")

  const changeChannel = () => {
    const { channelData } = channel;

    if (channelType == channelData.type) {
      return ;
    }

    channelData.type = channelType;

    if (channelType == ChannelType.PROTECTED) {
      channelData.password = channelPassword;
    }

    setChannelPassword("")
  }

    return (
      <Popup className="popup">
        
      </Popup>
    );
}

export default ManageChannelPopup;