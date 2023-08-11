import React, { useState } from "react";
import Popup from "./Popup";

import PublicIcon from "../../assets/globe.png"
import PrivateIcon from "../../assets/private.png"
import ProtectedIcon from "../../assets/padlock.png"

export default function ChatMetadata() {
  const [isMoreActive, setIsMoreActive] = useState(false);
  const [channelPopup, setChannelPopup] = useState(false)

  const handleMoreClick = (event) => {
    if (!isMoreActive == false)
      setChannelPopup(false)

    setIsMoreActive(!isMoreActive);
  }

  const channelCreation = () => {
    setChannelPopup(!channelPopup)
  }

  const sendDirectMessage = () => {

  }

  const restrictUser = () => {

  }

  const channelList = () => {

  }

  const popupText = () => {
    return (
      <div className="popups-container">
        <Popup className="more-popup">
          <p onClick={channelCreation}>Créer un channel</p>
          <p onClick={sendDirectMessage}>Envoyer un dm</p>
          <p onClick={restrictUser}>Bloquer/Débloquer un utilisateur</p>
          <p onClick={channelList}>Liste des channels</p>

          {channelPopup &&
            <Popup className="channel-creation-popup">
              <input placeholder="Nom du channel" required/>
              <div className="icons">
                <img src={PublicIcon}></img>
                <img src={PrivateIcon}></img>
                <img src={ProtectedIcon}></img>
              </div>
            </Popup>}
        </Popup>
      </div>
    )
  }

  return (
    <div className="metadata-container">
      <div className="more" onClick={handleMoreClick}>

        <div className={"more-symbol " + (isMoreActive ? "active" : "")}>
          <span></span> {/* Useful for the more symbol animation */}
        </div>

        {isMoreActive && popupText()}

      </div>

      <div className="metadata">
        <div className="chat-info"></div>
        <div className="chat-icon"></div>
      </div>
    </div>
  );
}