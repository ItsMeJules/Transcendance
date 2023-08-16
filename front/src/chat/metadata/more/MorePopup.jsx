import React from "react";

import Popup from "./Popup"
import ChannelCreationPopup from "./types/ChannelCreationPopup";
import DirectMessagePopup from "./types/DirectMessagePopup";
import RestrictUserPopup from "./types/RestrictUserPopup";
import ChannelListPopup from "./types/ChannelListPopup";

export default function MorePopup(
  { channelPopup, setChannelPopup,
    directMessagePopup, setDirectMessagePopup,
    restrictUserPopup, setRestrictUserPopup,
    channelListPopup, setChannelListPopup,
    resetPopups }) {

  const channelCreation = () => {
    resetPopups()
    setChannelPopup(!channelPopup)
  }

  const sendDirectMessage = () => {
    resetPopups()
    setDirectMessagePopup(!directMessagePopup)
  }

  const restrictUser = () => {
    resetPopups()
    setRestrictUserPopup(!restrictUserPopup)
  }

  const channelList = () => {
    resetPopups()
    setChannelListPopup(!channelListPopup)
  }

  return (
    <div className="popups-container">
      <Popup className="more-popup">
        <div className="contents">
          <p onClick={channelCreation}>Créer un channel</p>
          <p onClick={sendDirectMessage}>Envoyer un dm</p>
          <p onClick={restrictUser}>Bloquer/Débloquer un utilisateur</p>
          <p onClick={channelList}>Liste des channels</p>
        </div>

        {channelPopup && <ChannelCreationPopup />}
        {directMessagePopup && <DirectMessagePopup />}
        {restrictUserPopup && <RestrictUserPopup />}
        {channelListPopup && <ChannelListPopup />}
      </Popup>
    </div>
  )
}