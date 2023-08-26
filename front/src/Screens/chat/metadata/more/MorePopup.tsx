import React from "react";

import Popup from "../../utils/Popup";
import { PopupType } from "../ChatMetadata";
import ChannelCreationPopup from "./popups/ChannelCreationPopup";
import ChannelListPopup from "./popups/ChannelListPopup";
import { Channel } from "../../models/Channel";
import AllUsersPopup from "./popups/AllUsersPopup";

interface MorePopupProps {
  popupType: PopupType | null;
  setPopupActive: React.Dispatch<React.SetStateAction<PopupType | null>>;
}

export default function MorePopup({ popupType, setPopupActive }: MorePopupProps) {

  const channelCreation = () => {
    setPopupActive(popupType === PopupType.CHANNEL ? null : PopupType.CHANNEL);
  };

  const allUsersList = () => {
    setPopupActive(popupType === PopupType.ALL_USERS ? null : PopupType.ALL_USERS);
  };

  const channelList = () => {
    setPopupActive(popupType === PopupType.CHANNEL_LIST ? null : PopupType.CHANNEL_LIST);
  };

  return (
    <Popup className="more-popup">
      <div className="contents">
        <p onClick={channelCreation}>Créer un channel</p>
        <p onClick={allUsersList}>Liste de tous les utilisateurs</p>
        <p onClick={channelList}>Liste des channels</p>
      </div>

      {popupType === PopupType.CHANNEL && <ChannelCreationPopup />}
      {popupType === PopupType.ALL_USERS && <AllUsersPopup />}
      {/* {popupType === PopupType.CHANNEL_LIST && <ChannelListPopup channels={channels} />} */}
    </Popup>
  );
}
