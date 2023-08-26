import { useState } from "react";

import SettingsIcon from "../../assets/settings.png";

import { ChannelData } from "../../models/Channel";
import ManageChannelPopup from "./popups/ManageChannelPopup";
import OutsideClickHandler from "../../utils/OutsideClickHandler";
import Popup from "../../utils/Popup";
import UsersList from "../../utils/UsersList";

interface ChannelManagerProps {
  channelData: ChannelData | null;
}

export default function ChannelManager(props: ChannelManagerProps) {
  const [manageChannel, setManageChannel] = useState<boolean>(false);
  const [channelUsersList, toggleChannelUsersList] = useState<boolean>(false);
  const [searchText, setSearchText] = useState("");

  const { channelData }: ChannelManagerProps = props;
  const usersSize = channelData?.usersId?.length || 0

  const manageStyle = {
    transition: "transform 1s ease",
    transform: manageChannel ? "rotate(90deg)" : "",
  };

  return (
    <>
      <div className="channel-infos">
        <div className="channel-name">
          {channelData?.name}
        </div>

        <OutsideClickHandler className="channel-users-container"
          onOutsideClick={() => toggleChannelUsersList(false)}
          onInsideClick={() => toggleChannelUsersList(!channelUsersList)}
        >
          <div className="channel-users-count">
            {"Nombre d'utilisateur " + (usersSize > 1 ? "s" : "") + " : " + usersSize}
          </div>

          {channelUsersList &&
            <div className="popup-container">
              <Popup className="channel-users-popup">
                <input
                  className="filter-users"
                  type="search"
                  placeholder="Chercher un utilisateur"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
                <UsersList filter={(userName) => userName.includes(searchText)} />
              </Popup>
            </div>
          }
        </OutsideClickHandler>
      </div>

      <OutsideClickHandler className="manage"
        onOutsideClick={() => setManageChannel(false)}
        onInsideClick={() => setManageChannel(!manageChannel)} >
        <img
          alt="Settings"
          src={SettingsIcon}
          style={manageStyle}
        />

        {manageChannel && <ManageChannelPopup channelData={channelData} />}
      </OutsideClickHandler>
    </>
  )
}