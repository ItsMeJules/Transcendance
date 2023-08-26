import axios from "axios";
import { KeyboardEvent, useEffect, useState } from "react";

import { API_ROUTES } from "../../../../../Utils";
import { useAppSelector } from "../../../../../redux/Store";
import { ChannelInfoInList } from "../../../models/partial/PartialModels";
import ChannelsList from "../../../utils/ChannelsList";
import Popup from "../../../utils/Popup";

export default function ChannelListPopup() {
  const [selectedChannelName, setSelectedChannelName] = useState<string | null>(null);
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [visibleChannels, setVisibleChannels] = useState<ChannelInfoInList[]>([])
  const [searchText, setSearchText] = useState("");

  const visibleChannelsStore = useAppSelector(store => store.channels.visibleChannels)

  useEffect(() => {
    const requestVisibleChannels = async () => {
      try {
        const response = await axios.get(API_ROUTES.VISIBLE_CHANNELS, { withCredentials: true });
        setVisibleChannels(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    requestVisibleChannels()
  }, [visibleChannelsStore]) // add dependencies

  const joinChannel = () => {
    // if (selectedChannel == null)
    //   return;
    // if (selectedChannel.channelData.type === ChannelType.PROTECTED && !passwordValue.trim())
    //   return ;

    // setPasswordValue("")
    // setSelectedChannel(null)
  }

  const handleEnterPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")
      joinChannel()
  }

  return (
    <>
      <Popup className="channel-list-popup">
        <input
          className="filter-channels"
          type="search"
          placeholder="Chercher un channel"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <ChannelsList
          channels={visibleChannels}
          onClickElement={setSelectedChannelName}
          filter={(channelName) => channelName.includes(searchText)}
        />
      </Popup>

      {selectedChannelName && (
        <div className="password-popup">
          <div className="password-popup-content">

            <div className="infos">
              <h3>Rejoindre<br />{selectedChannelName}</h3>
              <input placeholder="Entrez le mdp..."
                onChange={(e) => setPasswordValue(e.target.value)}
                value={passwordValue}
                onKeyDown={(e) => handleEnterPressed(e)}
              />
            </div>

            <div className="buttons">
              <button className="cancel" onClick={() => setSelectedChannelName("")}>Annuler</button>
              <button className="validate" onClick={joinChannel}>Rejoindre</button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}