import React, { useState } from "react";

import Popup from "../Popup"

import PublicIcon from "../../../../assets/globe.png"
import PrivateIcon from "../../../../assets/private.png"
import ProtectedIcon from "../../../../assets/padlock.png"

export default function ChannelCreationPopup() {
  const [passwordInput, setPasswordInput] = useState(false)
  const [channelName, setChannelName] = useState("")
  const [channelPassword, setChannelPassword] = useState("")

  const createChannel = () => {
    if (!channelName.trim())
      return ;
    if (passwordInput && !channelPassword.trim())
      return ;

    console.log(channelName, channelPassword)
    setChannelName("")
    setChannelPassword("")
  }

  return (
    <Popup className="channel-creation-popup">

      <div className="icons">
        <img src={PublicIcon} alt="Public"onClick={() => setPasswordInput(false)}></img>
        <img src={PrivateIcon} alt="Private"onClick={() => setPasswordInput(false)}></img>
        <img src={ProtectedIcon} alt="Protected" onClick={() => setPasswordInput(!passwordInput)}></img>
      </div>

      <div className="channel-name">
        <input placeholder="Nom du channel"
          onChange={(e) => setChannelName(e.target.value)}
          value={channelName}
          required />
      </div>

      {passwordInput &&
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