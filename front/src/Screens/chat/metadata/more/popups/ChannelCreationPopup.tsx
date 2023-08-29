import { useContext, useState } from "react";

import Popup from "../../../utils/Popup";

import PublicIcon from "../../../../../assets/globe.png";
import ProtectedIcon from "../../../../../assets/padlock.png";
import PrivateIcon from "../../../../../assets/private.png";
import { SendDataContext } from "../../../ChatBox";
import { ChannelType, ChannelTypeDescription } from "../../../models/Channel";
import PayloadAction from "../../../models/PayloadSocket";
import { ChatSocketActionType } from "../../../models/TypesActionsEvents";

export default function ChannelCreationPopup() {
  const [channelType, setChannelType] = useState(ChannelType.PUBLIC);
  const [channelName, setChannelName] = useState("");
  const [channelPassword, setChannelPassword] = useState("");

  const sendData: null | ((action: ChatSocketActionType, data: PayloadAction) => void) =
    useContext(SendDataContext);

  const createChannel = () => {
    if (sendData == null) return;
    if (!channelName.trim()) return;
    if (channelType === ChannelType.PROTECTED && !channelPassword.trim()) return;

    const channelData = {
      type: channelType,
      roomName: channelName,
      password: channelPassword,
      action: ChatSocketActionType.CREATE_CHANNEL,
    };

    sendData(ChatSocketActionType.CREATE_CHANNEL, channelData as PayloadAction);
    setChannelName("");
    setChannelPassword("");
  };

  return (
    <Popup className="channel-creation-popup">
      <div className="icons">
        <div className="selected-text">
          <p className="type">Type: {ChannelTypeDescription[channelType].name}</p>
          <p className="description">{ChannelTypeDescription[channelType].desc}</p>
        </div>

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
      </div>

      <div className="channel-name">
        <input
          placeholder="Nom du channel"
          onChange={(e) => setChannelName(e.target.value)}
          value={channelName}
          required
        />
      </div>

      {channelType === ChannelType.PROTECTED && (
        <div className="password-input">
          <input
            placeholder="Entrez le mdp du channel."
            onChange={(e) => setChannelPassword(e.target.value)}
            value={channelPassword}
            required
          />
        </div>
      )}

      <div className="validate">
        <p onClick={createChannel}>Créer le channel</p>
      </div>
    </Popup>
  );
}
