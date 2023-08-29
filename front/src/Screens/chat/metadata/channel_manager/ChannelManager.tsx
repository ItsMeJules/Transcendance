import { useState } from "react";

import SettingsIcon from "../../assets/settings.png";

import { ChannelData } from "../../models/Channel";
import OutsideClickHandler from "../../utils/OutsideClickHandler";
import ManageChannelPopup from "./popups/ManageChannelPopup";
import ChannelUsersPopup from "./popups/users/ChannelUsersPopup";

interface ChannelManagerProps {
  channelData: ChannelData;
}

export default function ChannelManager(props: ChannelManagerProps) {
  const [manageChannel, setManageChannel] = useState<boolean>(false);
  const [channelUsersList, toggleChannelUsersList] = useState<boolean>(false);

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
            {"Membres : " + usersSize}
          </div>
          {channelUsersList ? <ChannelUsersPopup roomName={channelData.name} /> : undefined}
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