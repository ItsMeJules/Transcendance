import React, { useContext, useState } from "react";

import PublicIcon from "../../../../../assets/globe.png";
import ProtectedIcon from "../../../../../assets/padlock.png";
import PrivateIcon from "../../../../../assets/private.png";

import { useAppSelector } from "../../../../../redux/Store";
import { SendDataContext } from "../../../ChatBox";
import { ChannelData, ChannelType, ChannelTypeDescription } from "../../../models/Channel";
import PayloadAction from "../../../models/PayloadSocket";
import { ChatSocketActionType } from "../../../models/TypesActionsEvents";
import Popup from "../../../utils/Popup";

interface ChannelPopupProps {
  channelData: ChannelData;
}

const ManageChannelPopup: React.FC<ChannelPopupProps> = (props: ChannelPopupProps) => {
  const [channelType, setChannelType] = useState(ChannelType.PUBLIC);
  const [channelPassword, setChannelPassword] = useState("");

  const { currentRoom: activeChannelName } = useAppSelector((store) => store.user.userData);
  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext);

  const changeChannel = () => {
    const { channelData } = props;

    if (!channelData || channelType === channelData.type) return;

    if (channelType === ChannelType.PROTECTED) channelData.password = channelPassword;

    sendData?.(ChatSocketActionType.CHANGE_PASSWORD, {
      action: ChatSocketActionType.CHANGE_PASSWORD,
      password: channelPassword,
    });
    channelData.type = channelType;
    setChannelPassword("");
  };

  const quitChannel = () => {
    if (sendData === null) return;

    sendData(ChatSocketActionType.LEAVE_ROOM, {
      action: ChatSocketActionType.LEAVE_ROOM,
      roomName: activeChannelName,
    } as PayloadAction);
  };

  return (
    <Popup className="channel-popup">
      <div className="channel-description">{ChannelTypeDescription[channelType].desc}</div>

      <div className="images">
        <img
          className={`public ${channelType === ChannelType.PUBLIC ? "selected" : ""}`}
          src={PublicIcon}
          alt="Public"
          onClick={() => setChannelType(ChannelType.PUBLIC)}
        />
        <img
          className={`private ${channelType === ChannelType.PRIVATE ? "selected" : ""}`}
          src={PrivateIcon}
          alt="Private"
          onClick={() => setChannelType(ChannelType.PRIVATE)}
        />
        <img
          className={`protected ${channelType === ChannelType.PROTECTED ? "selected" : ""}`}
          src={ProtectedIcon}
          alt="Protected"
          onClick={() => setChannelType(ChannelType.PROTECTED)}
        />
      </div>

      {channelType === ChannelType.PROTECTED && (
        <div className="password-input">
          <input
            placeholder="Entrez le nouveau mdp du channel."
            onChange={(e) => setChannelPassword(e.target.value)}
            value={channelPassword}
            required
          />
        </div>
      )}

      <div className="validate">
        <p onClick={changeChannel}>Modifier le channel</p>
      </div>

      <div className="quit-channel">
        <p onClick={quitChannel}>Quitter le channel</p>
      </div>
    </Popup>
  );
};

export default ManageChannelPopup;
