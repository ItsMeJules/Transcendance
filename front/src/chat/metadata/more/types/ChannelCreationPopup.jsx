import React, { useState } from "react";

import Popup from "../Popup"

import PublicIcon from "../../../../assets/globe.png"
import PrivateIcon from "../../../../assets/private.png"
import ProtectedIcon from "../../../../assets/padlock.png"

const ChannelType = {
  PUBLIC: "Public",
  PRIVATE: "Privé",
  PROTECTED: "Protégé"
}

export default function ChannelCreationPopup() {
  const [channelType, setChannelType] = useState(ChannelType.PUBLIC)
  const [channelName, setChannelName] = useState("")
  const [channelPassword, setChannelPassword] = useState("")

  const createChannel = () => {
    if (!channelName.trim())
      return;
    if (channelType === ChannelType.PROTECTED && !channelPassword.trim())
      return;

    console.log(channelName, channelPassword)
    setChannelName("")
    setChannelPassword("")
  }

  return (
    <Popup className="channel-creation-popup">

      <div className="icons">
        <div className="selected">Type:<br />{channelType}</div>
        <img className="public" src={PublicIcon} alt="Public" onClick={() => setChannelType(ChannelType.PUBLIC)}></img>
        <img className="private" src={PrivateIcon} alt="Private" onClick={() => setChannelType(ChannelType.PRIVATE)}></img>
        <img className="protected" src={ProtectedIcon} alt="Protected" onClick={() => setChannelType(ChannelType.PROTECTED)}></img>
      </div>

      <div className="channel-name">
        <input placeholder="Nom du channel"
          onChange={(e) => setChannelName(e.target.value)}
          value={channelName}
          required />
      </div>

      {channelType === ChannelType.PROTECTED &&
        <div className="password-input">
          <input placeholder="Entrez le mdp du channel."
            onChange={(e) => setChannelPassword(e.target.value)}
            value={channelPassword}
            required />
        </div>
      }

      <div className="validate"><p onClick={createChannel}>Créer le channel</p></div>

    </Popup>
  )

}