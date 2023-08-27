import axios from "axios";
import { KeyboardEvent, useContext, useEffect, useState } from "react";

import { API_ROUTES } from "../../../../../Utils";
import { useAppSelector } from "../../../../../redux/Store";
import { ChatSocketActionType, SendDataContext } from "../../../ChatBox";
import { ChannelType } from "../../../models/Channel";
import { ChannelInfoInList } from "../../../models/partial/PartialModels";
import ChannelsList from "../../../utils/ChannelsList";
import Popup from "../../../utils/Popup";

export default function ChannelListPopup() {
  const [selectedChannelName, setSelectedChannelName] = useState<string | null>(null);
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [visibleChannels, setVisibleChannels] = useState<ChannelInfoInList[]>([])
  const [searchText, setSearchText] = useState("");

  const visibleChannelsStore = useAppSelector(store => store.channels.visibleChannels)
  const sendData: null | ((action: ChatSocketActionType, data: any) => void) = useContext(SendDataContext)

  const shouldShowPopup = selectedChannelName !== null
  && visibleChannels.find(
    value => value.name === selectedChannelName)
  ?.type === ChannelType.PROTECTED

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

  const joinChannel = (channelName: string | null) => {
    if (sendData != null) {
      channelName = channelName === null ? selectedChannelName : channelName
      sendData(ChatSocketActionType.SWITCH_CHANNEL, { roomName: channelName, password: passwordValue })
    }

    setPasswordValue("")
    setSelectedChannelName(null)
  }

  const handleEnterPressed = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter")
      joinChannel(null)
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
          onClickElement={(channelName: string) => {
            joinChannel(channelName)
            setSelectedChannelName(channelName)
          }}
          filter={(channelName) => channelName.includes(searchText)}
        />
      </Popup>

      {shouldShowPopup
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

            </div>
          </div>
        )
      : (
        undefined
      )}
    </>
  )
}