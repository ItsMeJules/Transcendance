import { useRef, useState } from "react";

import BannedIcon from "../../assets/banned.png";
import SettingsIcon from "../../assets/settings.png";

import { ChannelData, ChannelType } from "../../models/Channel";
import OutsideClickHandler from "../../utils/OutsideClickHandler";
import BannedUsersPopup from "./popups/BannedUsersPopup";
import ChannelUsersPopup from "./popups/ChannelUsersPopup";
import ManageChannelPopup from "./popups/ManageChannelPopup";

interface ChannelManagerProps {
  channelData: ChannelData;
}

export default function ChannelManager(props: ChannelManagerProps) {
  const [manageChannel, setManageChannel] = useState<boolean>(false);
  const [channelUsersList, toggleChannelUsersList] = useState<boolean>(false);
  const [bannedUsersList, toggleBannedUsersList] = useState(false)

  const excludeRef = useRef<HTMLImageElement | null>(null);

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
          {channelData.type !== ChannelType.DIRECT && channelData.name !== "general"
          ?
            <img alt="Banned" src={BannedIcon} ref={excludeRef} onClick={() => toggleBannedUsersList(!bannedUsersList)}></img>
          : undefined}
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
          className="users-list-banned"
          exclude={excludeRef}
          onOutsideClick={() => toggleBannedUsersList(false)}
          onInsideClick={() => undefined}
        >
          <BannedUsersPopup channelData={channelData} />
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
