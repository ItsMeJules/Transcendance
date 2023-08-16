import React from "react";
import Popup from "./Popup";
import ChannelCreationPopup from "./ChannelCreationPopup";

interface MorePopupProps {
  channelPopup: boolean;
  setChannelPopup: (value: boolean) => void;
}

export default function MorePopup({
  channelPopup,
  setChannelPopup,
}: MorePopupProps) {
  const channelCreation = () => {
    setChannelPopup(!channelPopup);
  };

  const sendDirectMessage = () => {
    // Code to send a direct message
  };

  const restrictUser = () => {
    // Code to restrict or unrestrict a user
  };

  const channelList = () => {
    // Code to list the channels
  };

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
  );
}
