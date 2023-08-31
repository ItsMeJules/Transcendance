import React from "react";

import Popup from "../../utils/Popup";
import { PopupType } from "../ChatMetadata";
import AllUsersPopup from "./popups/AllUsersPopup";
import ChannelCreationPopup from "./popups/ChannelCreationPopup";
import ChannelListPopup from "./popups/ChannelListPopup";

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
        <p onClick={channelCreation}>Create Channel</p>
        <p onClick={allUsersList}>All Users</p>
        <p onClick={channelList}>Channel List</p>
      </div>

      {popupType === PopupType.CHANNEL && <ChannelCreationPopup />}
      {popupType === PopupType.ALL_USERS && <AllUsersPopup />}
      {popupType === PopupType.CHANNEL_LIST && <ChannelListPopup />}
    </Popup>
  );
}
