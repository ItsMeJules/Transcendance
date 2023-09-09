import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { API_ROUTES } from "utils/routing/routing";
import { SendDataContext } from "pages/ChatBox/ChatBox";
import { ChannelType } from "pages/ChatBox/models/Channel";
import { ChannelInfoInList } from "pages/ChatBox/models/partial/PartialModels";
import ChannelsList from "pages/ChatBox/utils/ChannelsList";
import Popup from "pages/ChatBox/utils/Popup";
import { ChatSocketActionType } from "pages/ChatBox/models/TypesActionsEvents";
import { useAppSelector } from "utils/redux/Store";
import { useAxios } from "utils/axiosConfig/axiosConfig";

export default function ChannelListPopup() {
  const [selectedChannelName, setSelectedChannelName] = useState<string | null>(null);
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [visibleChannels, setVisibleChannels] = useState<ChannelInfoInList[]>([]);
  const [searchText, setSearchText] = useState("");
  const customAxiosInstance = useAxios();

  const { currentRoom: activeChannelName, id: userId } = useAppSelector(store => store.user.userData)
  const sendData: null | ((action: string, data: any) => void) = useContext(SendDataContext)

  useEffect(() => {
    const requestVisibleChannels = async () => {
      try {
        const response = await customAxiosInstance.get(API_ROUTES.VISIBLE_CHANNELS, {
          withCredentials: true,
        });
        const filteredChannels = response.data.filter(
          (channel: ChannelInfoInList) =>
            channel.name !== activeChannelName &&
            channel.type !== ChannelType.DIRECT)
        setVisibleChannels(filteredChannels);
      } catch (error) { }
    };

    requestVisibleChannels()
  }, [activeChannelName])

  const userRequirePassword = (userId: number, channelName: string): boolean => {
    const channel: ChannelInfoInList | undefined = visibleChannels.find(value => value.name === channelName)

    if (!channel?.hasPassword)
      return false
    if (channel?.ownerId === userId)
      return false
    if (channel?.adminsId.find(adminId => adminId === userId) !== undefined)
      return false
    return true
  }

  const joinChannel = (channelName: string | null) => {
    if (sendData !== null) {
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
          placeholder="Search channel..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          maxLength={200}
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
            <div className="infos">
              <h3>Join<br />{selectedChannelName}</h3>
              <input placeholder="Enter password..."
                onChange={(e) => setPasswordValue(e.target.value)}
                value={passwordValue}
                onKeyDown={(e) => handleEnterPressed(e)}
                maxLength={200}
              />
            </div>

            <div className="buttons">
              <button className="validate" onClick={() => joinChannel(null)}>Join</button>
              <button className="cancel" onClick={() => setSelectedChannelName(null)}>Cancel</button>
            </div>
          </div>
        ) : undefined}
    </>
  );
}
