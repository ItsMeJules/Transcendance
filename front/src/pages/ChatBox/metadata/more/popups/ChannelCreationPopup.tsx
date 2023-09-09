import { useContext, useState } from "react";
import Popup from "pages/ChatBox/utils/Popup";


import { SendDataContext } from "pages/ChatBox/ChatBox";
import { ChannelType, ChannelTypeDescription } from "pages/ChatBox/models/Channel";
import PayloadAction from "pages/ChatBox/models/PayloadSocket";
import { ChatSocketActionType } from "pages/ChatBox/models/TypesActionsEvents";

export default function ChannelCreationPopup() {
  const [channelType, setChannelType] = useState(ChannelType.PUBLIC);
  const [channelName, setChannelName] = useState("");
  const [channelPassword, setChannelPassword] = useState("");

  const sendData: null | ((action: ChatSocketActionType, data: PayloadAction) => void) =
    useContext(SendDataContext);

  const createChannel = () => {
    if (channelName.substr(0, 3) === "dm-") return; // error message0,0,
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
            src="/images/globe.png"
            alt="Public"
            onClick={() => setChannelType(ChannelType.PUBLIC)}
          />
          <img
            className={`private ${channelType === ChannelType.PRIVATE ? "selected" : ""}`}
            src="/images/private.png"
            alt="Private"
            onClick={() => setChannelType(ChannelType.PRIVATE)}
          />
          <img
            className={`protected ${channelType === ChannelType.PROTECTED ? "selected" : ""}`}
            src="/images/padlock.png"
            alt="Protected"
            onClick={() => setChannelType(ChannelType.PROTECTED)}
          />
        </div>
      </div>

      <div className="channel-name">
        <input
          placeholder="Channel Name"
          onChange={(e) => setChannelName(e.target.value)}
          value={channelName}
          required
          maxLength={200}
        />
      </div>

      {channelType === ChannelType.PROTECTED && (
        <div className="password-input">
          <input
            placeholder="Password"
            onChange={(e) => setChannelPassword(e.target.value)}
            value={channelPassword}
            required
            maxLength={200}
          />
        </div>
      )}

      <div className="validate">
        <p onClick={createChannel}>Create Channel</p>
      </div>
    </Popup>
  );
}
