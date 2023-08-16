import React, { useState } from "react";
import Popup from "./Popup";

import PublicIcon from "../../assets/globe.png";
import PrivateIcon from "../../assets/private.png";
import ProtectedIcon from "../../assets/padlock.png";

export default function ChannelCreationPopup() {
  const [passwordInput, setPasswordInput] = useState(false);

  return (
    <Popup className="channel-creation-popup">
      <div className="icons">
        <img src={PublicIcon} alt="Public" />
        <img src={PrivateIcon} alt="Private" />
        <img
          src={ProtectedIcon}
          alt="Protected"
          onClick={() => setPasswordInput(!passwordInput)}
        />
      </div>

      <input placeholder="Nom du channel" required />

      {passwordInput && (
        <div className="password-input">
          <input placeholder="Entrez le mdp du channel." />
        </div>
      )}
    </Popup>
  );
}
