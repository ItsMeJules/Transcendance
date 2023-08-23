import React, { useState } from "react";

import Popup from "../../../utils/Popup";

import PublicIcon from "../../../../../assets/globe.png"
import PrivateIcon from "../../../../../assets/private.png"
import ProtectedIcon from "../../../../../assets/padlock.png"

import { useWebsocketContext } from "../../../../../Wrappers/Websocket";
import { ChannelType, ChannelTypeDescription } from "../../../models/Channel";

export default function ChannelCreationPopup() {
  const [channelType, setChannelType] = useState(ChannelType.PUBLIC)
  const [channelName, setChannelName] = useState("")
  const [channelPassword, setChannelPassword] = useState("")
  const socket = useWebsocketContext();

  const createChannel = () => {
    if (!channelName.trim())
      return;
    if (channelType === ChannelType.PROTECTED && !channelPassword.trim())
      return;

    // Temporary fix by Antoine
    const userDataString = localStorage.getItem("userData");

    let user = null;
    if (userDataString)
      user = JSON.parse(userDataString);

    const channelData = {type: channelType, name: channelName, password: channelPassword};

    socket.chat?.emit("channel_manager", {userId: user.id, channelData})
    setChannelName("")
    setChannelPassword("")
  }

  return (
    <Popup className="channel-creation-popup">
      <div className="icons">

        <div className="selected-text">
          <p className="type">Type: {ChannelTypeDescription[channelType].name}</p>
          <p className="description">{ChannelTypeDescription[channelType].desc}</p>
        </div>

        <div className="images">
          <img
            className="public"
            src={PublicIcon}
            alt="Public"
            onClick={() => setChannelType(ChannelType.PUBLIC)}
          ></img>
          <img
            className="private"
            src={PrivateIcon}
            alt="Private"
            onClick={() => setChannelType(ChannelType.PRIVATE)}
          ></img>
          <img
            className="protected"
            src={ProtectedIcon}
            alt="Protected"
            onClick={() => setChannelType(ChannelType.PROTECTED)}
          ></img>
        </div>

      </div>

      <div className="channel-name">
        <input
          placeholder="Nom du channel"
          onChange={(e) => setChannelName(e.target.value)}
          value={channelName}
          required
        />
      </div>

      {channelType === ChannelType.PROTECTED && (
        <div className="password-input">
          <input
            placeholder="Entrez le mdp du channel."
            onChange={(e) => setChannelPassword(e.target.value)}
            value={channelPassword}
            required
          />
        </div>
      )}

      <div className="validate">
        <p onClick={createChannel}>Créer le channel</p>
      </div>
    </Popup>
  );
}
