import React, { useState } from "react";

import Popup from "./Popup"

import PublicIcon from "../../../assets/globe.png"
import PrivateIcon from "../../../assets/private.png"
import ProtectedIcon from "../../../assets/padlock.png"

export default function ChannelCreationPopup() {
  const [passwordInput, setPasswordInput] = useState(false)

  return (
    <Popup className="channel-creation-popup">
      <input placeholder="Nom du channel" required />

      <div className="icons">
        <img src={PublicIcon} alt="Public"></img>
        <img src={PrivateIcon} alt="Private"></img>
        <img src={ProtectedIcon} alt="Protected" onClick={() => setPasswordInput(!passwordInput)}></img>
      </div>

      {passwordInput &&
        <div className="password-input">
          <input placeholder="Entrez le mdp du channel." />
        </div>}
    </Popup>
  )

}