import React from "react";

import Popup from "./Popup"
import { PopupType } from "../ChatMetadata";
import ChannelCreationPopup from "./types/ChannelCreationPopup";
import DirectMessagePopup from "./types/DirectMessagePopup";
import RestrictUserPopup from "./types/RestrictUserPopup";
import ChannelListPopup from "./types/ChannelListPopup";

export default function MorePopup( {popupType, setPopupActive} ) {

  const channelCreation = () => {
    setPopupActive(popupType == PopupType.CHANNEL ? null : PopupType.CHANNEL)
  }

  const sendDirectMessage = () => {
    setPopupActive(popupType == PopupType.DIRECT_MESSAGE ? null : PopupType.DIRECT_MESSAGE)
  }

  const restrictUser = () => {
    setPopupActive(popupType == PopupType.RESTRICT ? null : PopupType.RESTRICT)
  }

  const channelList = () => {
    setPopupActive(popupType == PopupType.CHANNEL_LIST ? null : PopupType.CHANNEL_LIST)
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

        {popupType == PopupType.CHANNEL && <ChannelCreationPopup />}
        {popupType == PopupType.DIRECT_MESSAGE && <DirectMessagePopup />}
        {popupType == PopupType.RESTRICT && <RestrictUserPopup />}
        {popupType == PopupType.CHANNEL_LIST && <ChannelListPopup />}
      </Popup>
    </div>
  )
}