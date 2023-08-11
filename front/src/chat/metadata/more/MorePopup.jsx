import React from "react";

import Popup from "./Popup"
import ChannelCreationPopup from "./ChannelCreationPopup";

export default function MorePopup( {channelPopup, setChannelPopup} ) {

  const channelCreation = () => {
    setChannelPopup(!channelPopup)
  }

  const sendDirectMessage = () => {

  }

  const restrictUser = () => {

  }

  const channelList = () => {

  }

  return (
    <div className="popups-container">
      <Popup className="more-popup">
        <p onClick={channelCreation}>Créer un channel</p>
        <p onClick={sendDirectMessage}>Envoyer un dm</p>
        <p onClick={restrictUser}>Bloquer/Débloquer un utilisateur</p>
        <p onClick={channelList}>Liste des channels</p>

        {channelPopup && <ChannelCreationPopup />}
      </Popup>
    </div>
  )
}