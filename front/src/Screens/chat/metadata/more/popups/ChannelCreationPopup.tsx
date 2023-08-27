import { useContext, useState } from "react";

import Popup from "../../../utils/Popup";

import PublicIcon from "../../../../../assets/globe.png";
import PrivateIcon from "../../../../../assets/private.png";
import ProtectedIcon from "../../../../../assets/padlock.png";
import PayloadAction from "../../../models/PayloadSocket";
import { ChannelType, ChannelTypeDescription } from "../../../models/Channel";
import { ChatSocketActionType, SendDataContext } from "../../../ChatBox";
import { useAppSelector } from "../../../../../redux/Store";

export default function ChannelCreationPopup() {
  const [channelType, setChannelType] = useState(ChannelType.PUBLIC);
  const [channelName, setChannelName] = useState("");
  const [channelPassword, setChannelPassword] = useState("");
  const { currentRoom: activeChannelName } = useAppSelector((store) => store.user.userData);

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
