import { useRef, useState } from "react";
import { ChannelData, ChannelType, PunishmentType } from "../../models/Channel";
import OutsideClickHandler from "../../utils/OutsideClickHandler";
import BannedUsersPopup from "./popups/BannedUsersPopup";
import ManageChannelPopup from "./popups/ManageChannelPopup";
import ChannelUsersPopup from "./popups/ChannelUsersPopup";

interface ChannelManagerProps {
  channelData: ChannelData;
}

export default function ChannelManager(props: ChannelManagerProps) {
  const [manageChannel, setManageChannel] = useState<boolean>(false);
  const [channelUsersList, toggleChannelUsersList] = useState<boolean>(false);
  const [bannedUsersList, toggleBannedUsersList] = useState(false);

  const excludeRef = useRef<HTMLImageElement | null>(null);
  let BannedIcon = require("../../assets/banned.png");
  let SettingsIcon = require("../../assets/settings.png");

  const { channelData }: ChannelManagerProps = props;
  const usersSize = channelData?.usersId?.length || 0;

  const manageStyle = {
    transition: "transform 1s ease",
    transform: manageChannel ? "rotate(60deg)" : "",
  };

  return (
    <>
      <div className="channel-infos">
        <div className="channel-name">
          <p>{channelData?.displayname}</p>
        </div>

        {channelData.type !== ChannelType.DIRECT ? (
          <OutsideClickHandler
            className="channel-users-container"
            onOutsideClick={() => toggleChannelUsersList(false)}
            onInsideClick={() => toggleChannelUsersList(!channelUsersList)}
          >
            <div className="channel-users-count">{"Total members: " + usersSize}</div>
            {channelUsersList ? <ChannelUsersPopup channelData={channelData} /> : undefined}
          </OutsideClickHandler>
        ) : undefined}
      </div>

      {bannedUsersList ? (
        <OutsideClickHandler
          className="users-list-banned"
          exclude={excludeRef}
          onOutsideClick={() => toggleBannedUsersList(false)}
          onInsideClick={() => undefined}
        >
          <BannedUsersPopup channelData={channelData} />
        </OutsideClickHandler>
      ) : undefined}

      {channelData.type !== ChannelType.DIRECT &&
        channelData.name !== "general"
        ?
        <div className="manage">
          <OutsideClickHandler
            className="manage-img"
            onOutsideClick={() => setManageChannel(false)}
            onInsideClick={() => setManageChannel(!manageChannel)}
          >
            <img alt="Settings" src="/images/settings.png" style={manageStyle} />

            {manageChannel && <ManageChannelPopup channelData={channelData} />}
          </OutsideClickHandler>

          {channelData.punishments?.some(punishment => punishment.type === PunishmentType.BAN) ? (
            <img
              className="banned-img"
              alt="Banned"
              src={BannedIcon}
              ref={excludeRef}
              onClick={() => toggleBannedUsersList(!bannedUsersList)}
            ></img>
          ) : undefined}
        </div>
        : undefined}
    </>
  );
}
