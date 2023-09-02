import { useState } from "react";

import { ChannelData } from "../../models/Channel";
import OutsideClickHandler from "../../utils/OutsideClickHandler";
import ManageChannelPopup from "./popups/ManageChannelPopup";
import ChannelUsersPopup from "./popups/ChannelUsersPopup";

interface ChannelManagerProps {
  channelData: ChannelData;
}

export default function ChannelManager(props: ChannelManagerProps) {
  const [manageChannel, setManageChannel] = useState<boolean>(false);
  const [channelUsersList, toggleChannelUsersList] = useState<boolean>(false);

  const { channelData }: ChannelManagerProps = props;
  const usersSize = channelData?.usersId?.length || 0;

  const manageStyle = {
    transition: "transform 1s ease",
    transform: manageChannel ? "rotate(90deg)" : "",
  };

  return (
    <>
      <div className="channel-infos">
        <div className="channel-name">{channelData?.name}</div>

        <OutsideClickHandler
          className="channel-users-container"
          onOutsideClick={() => toggleChannelUsersList(false)}
          onInsideClick={() => toggleChannelUsersList(!channelUsersList)}
        >
          <div className="channel-users-count">{"Members : " + usersSize}</div>
          {channelUsersList ? <ChannelUsersPopup channelData={channelData} /> : undefined}
        </OutsideClickHandler>
      </div>

      <OutsideClickHandler
        className="manage"
        onOutsideClick={() => setManageChannel(false)}
        onInsideClick={() => setManageChannel(!manageChannel)}
      >
        <img alt="Settings" src="/images/settings.png" style={manageStyle} />

        {manageChannel && <ManageChannelPopup channelData={channelData} />}
      </OutsideClickHandler>
    </>
  );
}
