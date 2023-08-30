import React, { useState } from "react";

import PublicIcon from "pages/ChatBox/assets/globe.png"
import PrivateIcon from "pages/ChatBox/assets/private.png"
import ProtectedIcon from "pages/ChatBox/assets/padlock.png"

import Popup from "../../../utils/Popup";
import { ChannelData, ChannelType, ChannelTypeDescription } from "../../../models/Channel";

interface ChannelPopupProps {
  channelData: ChannelData
}

const ManageChannelPopup: React.FC<ChannelPopupProps> = (props: ChannelPopupProps) => {
  const [channelType, setChannelType] = useState(ChannelType.PUBLIC);
  const [channelPassword, setChannelPassword] = useState("");

  const changeChannel = () => {
    const { channelData } = props;

    if (!channelData || channelType === channelData.type)
      return;

    if (channelType === ChannelType.PROTECTED)
      channelData.password = channelPassword;

    channelData.type = channelType;
    setChannelPassword("");
  }

  const quitChannel = () => {

  }

  return (
    <Popup className="channel-popup">
      <div className="channel-description">
        {ChannelTypeDescription[channelType].desc}
      </div>

      <div className="images">
        <img
          className={`public ${channelType === ChannelType.PUBLIC ? "selected" : ""}`}
          src={PublicIcon}
          alt="Public"
          onClick={() => setChannelType(ChannelType.PUBLIC)}
        />
        <img
          className={`private ${channelType === ChannelType.PRIVATE ? "selected" : ""}`}
          src={PrivateIcon}
          alt="Private"
          onClick={() => setChannelType(ChannelType.PRIVATE)}
        />
        <img
          className={`protected ${channelType === ChannelType.PROTECTED ? "selected" : ""}`}
          src={ProtectedIcon}
          alt="Protected"
          onClick={() => setChannelType(ChannelType.PROTECTED)}
        />
      </div>

      {channelType === ChannelType.PROTECTED && (
        <div className="password-input">
          <input
            placeholder="Entrez le nouveau mdp du channel."
            onChange={(e) => setChannelPassword(e.target.value)}
            value={channelPassword}
            required
          />
        </div>
      )}

      <div className="validate">
        <p onClick={changeChannel}>Modifier le channel</p>
      </div>

        <div className="quit-channel">
          <p onClick={quitChannel}>Quitter le channel</p>
        </div>
    </Popup>
  );
}

export default ManageChannelPopup;
