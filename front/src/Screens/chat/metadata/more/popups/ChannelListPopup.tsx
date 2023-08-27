import axios from "axios";
import { KeyboardEvent, useContext, useEffect, useState } from "react";

import { API_ROUTES } from "../../../../../Utils";
import { SendDataContext } from "../../../ChatBox";
import { ChannelType } from "../../../models/Channel";
import { ChannelInfoInList } from "../../../models/partial/PartialModels";
import ChannelsList from "../../../utils/ChannelsList";
import Popup from "../../../utils/Popup";
import { ChatSocketActionType } from "../../../models/TypesActionsEvents";

export default function ChannelListPopup() {
  const [selectedChannelName, setSelectedChannelName] = useState<string | null>(null);
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [visibleChannels, setVisibleChannels] = useState<ChannelInfoInList[]>([]);
  const [searchText, setSearchText] = useState("");

  // const visibleChannelsStore = useAppSelector(store => store.channels.visibleChannels)
  const sendData: null | ((action: string, data: any) => void) = useContext(SendDataContext)

  useEffect(() => {
    const requestVisibleChannels = async () => {
      try {
        const response = await axios.get(API_ROUTES.VISIBLE_CHANNELS, {
          withCredentials: true,
        });
        setVisibleChannels(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    requestVisibleChannels()
  }, [/*visibleChannelsStore*/])

  const channelHasPassword = (name: string | null) => {
    if (name === null)
      return false

    return visibleChannels.find(value => value.name === name)
      ?.type === ChannelType.PROTECTED
  }

  const joinChannel = (channelName: string | null) => {
    if (sendData != null) {
      channelName = channelName === null ? selectedChannelName : channelName;
      sendData(ChatSocketActionType.SWITCH_CHANNEL, {
        action: "joinRoom",
        roomName: channelName,
        password: passwordValue,
      });
    }

    setPasswordValue("");
    setSelectedChannelName(null);
  };

  const handleEnterPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") joinChannel(null);
  };

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
          onClickElement={(channelName: string) => {
            if (!channelHasPassword(channelName))
              joinChannel(channelName)
            else
              setSelectedChannelName(channelName)
          }}
          filter={(channelName) => channelName.includes(searchText)}
        />
      </Popup>

      {channelHasPassword(selectedChannelName)
        ? (
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
                <button className="cancel" onClick={() => setSelectedChannelName(null)}>Annuler</button>
                <button className="validate" onClick={() => joinChannel(null)}>Rejoindre</button>
              </div>

            <div className="buttons">
              <button className="cancel" onClick={() => setSelectedChannelName(null)}>
                Annuler
              </button>
              <button className="validate" onClick={() => joinChannel(null)}>
                Rejoindre
              </button>
            </div>
          </div>
        </div>
      ) : undefined}
    </>
  );
}
