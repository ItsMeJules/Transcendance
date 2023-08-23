import { useState } from "react";

import SettingsIcon from "../../assets/settings.png";

import { Channel } from "../../models/Channel";
import ManageChannelPopup from "./popups/ManageChannelPopup";
import OutsideClickHandler from "../../utils/OutsideClickHandler";
import Popup from "../../utils/Popup";
import UsersList from "../../utils/UsersList";

interface ChannelManagerProps {
  channel: Channel;
}

export default function ChannelManager(props: ChannelManagerProps) {
  const [manageChannel, setManageChannel] = useState<boolean>(false);
  const [channelUsersList, toggleChannelUsersList] = useState<boolean>(false);

  const { channel }: ChannelManagerProps = props;
  const usersSize = channel.channelData.users?.length || 0

  const manageStyle = {
    transition: "transform 1s ease",
    transform: manageChannel ? "rotate(90deg)" : "",
  };

  return (
    <>
      <div className="channel-infos">
        <div className="channel-name">
          {channel.channelData.name}
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
                <UsersList />
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

        {manageChannel && <ManageChannelPopup channel={channel} />}
      </OutsideClickHandler>
    </>
  )
}