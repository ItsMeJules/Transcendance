import { useState } from "react";

import SettingsIcon from "../../assets/settings.png";
import BannedIcon from "../../assets/banned.png"

import { ChannelData, ChannelType, PunishmentType } from "../../models/Channel";
import OutsideClickHandler from "../../utils/OutsideClickHandler";
import ManageChannelPopup from "./popups/ManageChannelPopup";
import ChannelUsersPopup from "./popups/ChannelUsersPopup";
import BannedUsersPopup from "./popups/BannedUsersPopup";

interface ChannelManagerProps {
  channelData: ChannelData;
}

export default function ChannelManager(props: ChannelManagerProps) {
  const [manageChannel, setManageChannel] = useState<boolean>(false);
  const [channelUsersList, toggleChannelUsersList] = useState<boolean>(false);
  const [bannedUsersList, toggleBannedUsersList] = useState(false)

  const { channelData }: ChannelManagerProps = props;
  const usersSize = channelData?.usersId?.length || 0;

  const manageStyle = {
    transition: "transform 1s ease",
    transform: manageChannel ? "rotate(90deg)" : "",
  };

  return (
    <>
      <div className="channel-infos">
        <div className="channel-name">
          <p>{channelData?.displayname}</p>
          <img alt="Banned" src={BannedIcon} onClick={() => toggleBannedUsersList(!bannedUsersList)}></img>
        </div>

        {channelData.type !== ChannelType.DIRECT
          ?
          <OutsideClickHandler
            className="channel-users-container"
            onOutsideClick={() => toggleChannelUsersList(false)}
            onInsideClick={() => toggleChannelUsersList(!channelUsersList)}
          >
            <div className="channel-users-count">{"Membres total: " + usersSize}</div>
            {channelUsersList ? <ChannelUsersPopup channelData={channelData} /> : undefined}
          </OutsideClickHandler>
          : undefined}
      </div>

      {bannedUsersList
        ?
          <OutsideClickHandler
            className="banned-users"
            onOutsideClick={() => toggleBannedUsersList(false)}
            onInsideClick={() => toggleBannedUsersList(!bannedUsersList)}
          >
            <BannedUsersPopup channelData={channelData}/>
          </OutsideClickHandler>
      : undefined}

      <OutsideClickHandler
        className="manage"
        onOutsideClick={() => setManageChannel(false)}
        onInsideClick={() => setManageChannel(!manageChannel)}
      >
        <img alt="Settings" src={SettingsIcon} style={manageStyle} />

        {manageChannel && <ManageChannelPopup channelData={channelData} />}
      </OutsideClickHandler>
    </>
  );
}
