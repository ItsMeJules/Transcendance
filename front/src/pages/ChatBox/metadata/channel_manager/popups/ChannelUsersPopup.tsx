import { useContext, useEffect, useState } from "react";

import { UserData } from "services/User/User";
import { useWebsocketContext } from "services/Websocket/Websocket";
import { useAppSelector } from "utils/redux/Store";
import { SendDataContext } from "../../../ChatBox";
import {
  ChannelData,
  ChannelUser,
  ChannelUserRole,
  createChannelUser,
} from "../../../models/Channel";
import PayloadAction from "../../../models/PayloadSocket";
import { RoomSocketActionType } from "../../../models/TypesActionsEvents";
import Popup from "../../../utils/Popup";
import ChannelUsersList from "../../../utils/users/ChannelUsersList";
import UserActionPopup from "../../../utils/users/UserActionPopup";
import { UserClickParameters } from "../../../utils/users/UserComponent";

interface ChannelUsersPopupProps {
  channelData: ChannelData;
}

export default function ChannelUsersPopup({ channelData }: ChannelUsersPopupProps) {
  const [searchText, setSearchText] = useState("");
  const { username: activeUserName, id: activeId } = useAppSelector(
    (store) => store.user.userData
  );

  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext);
  const chatSocket = useWebsocketContext().chat;
  const [channelUsers, setChannelUsers] = useState<ChannelUser[]>([]);

  const [channelUserClicked, setChannelUserClicked] = useState<ChannelUser | null>(null);
  const [buttonClicked, setButtonClicked] = useState<number>(-1);

  // Parses all the users in the room
  useEffect(() => {
    chatSocket?.on(RoomSocketActionType.USERS_ON_ROOM, (payload: any) => {
      const channelusers = payload.users.filter(
        (userData: UserData) => userData.id !== activeId
      );

      if (channelUserClicked !== null) {
        // This is disgusting but I don't care
        if (channelusers.length !== 0) {
          const user = channelusers.find(
            (userData: UserData) => userData.id === channelUserClicked.id
          );
          setChannelUserClicked(
            user === undefined ? null : createChannelUser(user, channelData)
          );
        } else {
          setChannelUserClicked(null);
        }
      }

      setChannelUsers(
        channelusers.map((userData: UserData) => createChannelUser(userData, channelData))
      );
    });

    return () => {
      chatSocket?.off(RoomSocketActionType.USERS_ON_ROOM);
    };
  }, [chatSocket, channelData, activeId, channelUserClicked]);

  // Triggers the request for users in the room
  useEffect(() => {
    if (sendData === null) return;

    sendData(RoomSocketActionType.USERS_ON_ROOM, {
      roomName: channelData.name,
      action: "getRoomUsers",
    } as PayloadAction);
  }, [sendData, channelData]);

  const onUserClick = ({ event, userData }: UserClickParameters) => {
    setButtonClicked(event.button);
    setChannelUserClicked(createChannelUser(userData, channelData));
  };

  const filter = (userName: string, searchText: string): boolean => {
    return activeUserName !== userName && userName.includes(searchText);
  };

  return (
    <div className="popup-container">
      <Popup className="channel-users-popup">
        <input
          className="filter-users"
          type="search"
          placeholder="Search users..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          maxLength={200}
        />
        <ChannelUsersList
          users={channelUsers}
          filter={(userName) => filter(userName.toLowerCase(), searchText.toLowerCase())}
          onUserClick={onUserClick}
        />
      </Popup>

      {channelUserClicked !== null ? (
        <UserActionPopup
          userData={channelUserClicked}
          buttonClicked={buttonClicked}
          channelInvite={false}
          isAdmin={channelUserClicked.role === ChannelUserRole.ADMIN}
          isMuted={channelUserClicked.muted}
        />
      ) : undefined}
    </div>
  );
}
