import { useState, KeyboardEvent } from "react";

import Popup from "../../../utils/Popup"
import { Channel, ChannelType } from "../../../models/Channel";
import ChannelsList from "../../../utils/ChannelsList";

export default function ChannelListPopup() {
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [passwordValue, setPasswordValue] = useState<string>("");

  const joinChannel = () => {
    if (selectedChannel == null)
      return;
    if (selectedChannel.channelData.type === ChannelType.PROTECTED && !passwordValue.trim())
      return ;

    setPasswordValue("")
    setSelectedChannel(null)
  }

  const handleEnterPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")
      joinChannel()
  }

  return (
    <>
      <Popup className="channel-list-popup">
        <ChannelsList
          channels={channels}
          onClickElement={setSelectedChannel}
        />
      </Popup>

      {selectedChannel && (
        <div className="password-popup">
          <div className="password-popup-content">

            <div className="infos">
              <h3>Rejoindre<br />{selectedChannel.channelData.name}</h3>
              <input placeholder="Entrez le mdp..."
                onChange={(e) => setPasswordValue(e.target.value)}
                value={passwordValue}
                onKeyDown={(e) => handleEnterPressed(e)}
              />
            </div>

            <div className="buttons">
              <button className="cancel" onClick={() => setSelectedChannel(null)}>Annuler</button>
              <button className="validate" onClick={joinChannel}>Rejoindre</button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}