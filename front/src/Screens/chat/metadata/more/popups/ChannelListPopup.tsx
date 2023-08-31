import axios from "axios";
import { KeyboardEvent, useContext, useEffect, useState } from "react";

import { API_ROUTES } from "../../../../../Utils";
import { SendDataContext } from "../../../ChatBox";
import { ChannelType } from "../../../models/Channel";
import { ChannelInfoInList } from "../../../models/partial/PartialModels";
import ChannelsList from "../../../utils/ChannelsList";
import Popup from "../../../utils/Popup";
import { ChatSocketActionType } from "../../../models/TypesActionsEvents";
import { useAppSelector } from "../../../../../redux/Store";

export default function ChannelListPopup() {
  const [selectedChannelName, setSelectedChannelName] = useState<string | null>(null);
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [visibleChannels, setVisibleChannels] = useState<ChannelInfoInList[]>([]);
  const [searchText, setSearchText] = useState("");

  const { currentRoom: activeChannelName, id: userId } = useAppSelector(store => store.user.userData)
  const sendData: null | ((action: string, data: any) => void) = useContext(SendDataContext)

  useEffect(() => {
    const requestVisibleChannels = async () => {
      try {
        const response = await axios.get(API_ROUTES.VISIBLE_CHANNELS, {
          withCredentials: true,
        });
        const filteredChannels = response.data.filter(
          (channel: ChannelInfoInList) =>
            channel.name !== activeChannelName &&
            channel.type !== ChannelType.DIRECT)
            
        setVisibleChannels(filteredChannels);
      } catch (error) {
        console.log(error);
      }
    };

    requestVisibleChannels()
  }, [activeChannelName])

  const userRequirePassword = (userId: number, channelName: string): boolean => {
    const channel: ChannelInfoInList | undefined = visibleChannels.find(value => value.name === channelName)

    if (channel?.type !== ChannelType.PROTECTED)
      return false
    if (channel?.ownerId === userId)
      return false
    if (channel?.adminsId.find(adminId => adminId === userId) !== undefined)
      return false
    return true
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
            if (userId !== null && !userRequirePassword(parseInt(userId), channelName))
              joinChannel(channelName)
            else
              setSelectedChannelName(channelName)
          }}
          filter={(channelName) => channelName.toLowerCase().includes(searchText.toLowerCase())}
        />
      </Popup>

      {selectedChannelName !== null
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
        ) : undefined}
    </>
  );
}
