import React, { useContext, useState } from "react";


import { useAppSelector } from "../../../../../redux/Store";
import { SendDataContext } from "../../../ChatBox";
import { ChannelData, ChannelType, ChannelTypeDescription } from "../../../models/Channel";
import PayloadAction from "../../../models/PayloadSocket";
import { ChatSocketActionType } from "../../../models/TypesActionsEvents";
import Popup from "../../../utils/Popup";

interface ChannelPopupProps {
  channelData: ChannelData;
}

const ManageChannelPopup: React.FC<ChannelPopupProps> = ({ channelData }: ChannelPopupProps) => {
  const [channelPassword, setChannelPassword] = useState("");

  const { currentRoom: activeChannelName } = useAppSelector((store) => store.user.userData);
  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext);

  const changeChannel = () => {
    if (sendData === null) return;
    sendData(ChatSocketActionType.CHANGE_PASSWORD, {
      action: ChatSocketActionType.CHANGE_PASSWORD,
      password: channelPassword,
      roomName: activeChannelName,
    } as PayloadAction);
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
      <input
        placeholder="Entrez le mdp."
        onChange={(e) => setChannelPassword(e.target.value)}
        value={channelPassword}
        required
      />

      <div className="confirm">
        <button onClick={changeChannel}>
          {channelData.type !== ChannelType.PROTECTED
            ? "Ajouter un mot de passe"
            : "Changer le mot de passe"}
        </button>
      </div>

      <div className="quit-channel">
        <button onClick={quitChannel}>Quitter le channel</button>
      </div>
    </Popup>
  );
};

export default ManageChannelPopup;
