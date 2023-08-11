import React from "react";

import Popup from "./Popup"

import PublicIcon from "../../../assets/globe.png"
import PrivateIcon from "../../../assets/private.png"
import ProtectedIcon from "../../../assets/padlock.png"

export default function ChannelCreationPopup() {

  return (
    <Popup className="channel-creation-popup">
      <input placeholder="Nom du channel" required />
      <div className="icons">
        <img src={PublicIcon}></img>
        <img src={PrivateIcon}></img>
        <img src={ProtectedIcon}></img>
      </div>
    </Popup>
  )

}