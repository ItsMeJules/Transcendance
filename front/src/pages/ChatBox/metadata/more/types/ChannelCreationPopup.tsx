import { useState } from "react";
import { useWebsocketContext } from "services/Websocket/Websocket";
import Popup from "pages/ChatBox/utils/Popup";
import { ChannelType, ChannelTypeDescription } from "pages/ChatBox/models/Channel";

export default function ChannelCreationPopup() {
  const [channelType, setChannelType] = useState(ChannelType.PUBLIC)
  const [channelName, setChannelName] = useState("")
  const [channelPassword, setChannelPassword] = useState("")
  const socket = useWebsocketContext();

  const createChannel = () => {
    if (!channelName.trim())
      return;
    if (channelType === ChannelType.PROTECTED && !channelPassword.trim())
      return;

    // Temporary fix by Antoine
    const userDataString = localStorage.getItem("userData");

    let user = null;
    if (userDataString)
      user = JSON.parse(userDataString);

    const channelData = { type: channelType, name: channelName, password: channelPassword };

    socket.chat?.emit("channel_manager", { userId: user.id, channelData })
    setChannelName("")
    setChannelPassword("")
  }

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
          placeholder="Nom du channel"
          onChange={(e) => setChannelName(e.target.value)}
          value={channelName}
          required
          maxLength={200}
        />
      </div>

      {channelType === ChannelType.PROTECTED && (
        <div className="password-input">
          <input
            placeholder="Enter channel password."
            onChange={(e) => setChannelPassword(e.target.value)}
            value={channelPassword}
            required
            maxLength={200}
          />
        </div>
      )}

      <div className="validate">
        <p onClick={createChannel}>Créer le channel</p>
      </div>
    </Popup>
  );
}
