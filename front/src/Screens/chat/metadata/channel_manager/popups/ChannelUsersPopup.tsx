import { useContext, useEffect, useState } from "react";

import User, { UserData } from "../../../../../Services/User";
import { useWebsocketContext } from "../../../../../Wrappers/Websocket";
import { useAppSelector } from "../../../../../redux/Store";
import { SendDataContext } from "../../../ChatBox";
import { ChannelData, ChannelType, ChannelUser, ChannelUserRole, createChannelUser } from "../../../models/Channel";
import PayloadAction from "../../../models/PayloadSocket";
import { RoomSocketActionType } from "../../../models/TypesActionsEvents";
import Popup from "../../../utils/Popup";
import ChannelUsersList from "../../../utils/users/ChannelUsersList";
import UserActionPopup from "../../../utils/users/UserActionPopup";
import { UserClickParameters } from "../../../utils/users/UserComponent";
import UsersList from "../../../utils/users/UsersList";
import { fetchAllUsers } from "../../more/popups/AllUsersPopup";

interface ChannelUsersPopupProps {
  channelData: ChannelData;
}

export default function ChannelUsersPopup({ channelData }: ChannelUsersPopupProps) {
  const [searchText, setSearchText] = useState("");
  const [invitedUsername, setInvitedUsername] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const { username: activeUserName, id: activeId } = useAppSelector(store => store.user.userData)

  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext);
  const chatSocket = useWebsocketContext().chat;
  const [channelUsers, setChannelUsers] = useState<ChannelUser[]>([]);

  const [channelUserClicked, setChannelUserClicked] = useState<ChannelUser | null>(null);
  const [buttonClicked, setButtonClicked] = useState<number>(-1);

  // Parses all the users in the room
  useEffect(() => {
    chatSocket?.on(RoomSocketActionType.USERS_ON_ROOM, (payload: any) => {
      const channelusers = payload.users
        .filter((userData: UserData) => userData.id !== activeId)
        .map((userData: UserData) => createChannelUser(userData, channelData))

      if (channelUserClicked !== null) { // This is disgusting but I don't care
        const user = payload.users.find((userData: UserData) =>
          userData.id === channelUserClicked.id);
        setChannelUserClicked(createChannelUser(user, channelData))
      }
      setChannelUsers(channelusers);
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

  const onSearching = async (text: string, inputId: number) => {
    if (inputId === 0) {
      if (invitedUsername !== null) setInvitedUsername(null);

      setSearchText(text);
    } else {
      if (searchText.length !== 0) setSearchText("");
      if (allUsers.length === 0) {
        const allUsers = await fetchAllUsers();
        setAllUsers(allUsers)
      }

      setInvitedUsername(text);
    }
    setButtonClicked(-1);
    setChannelUserClicked(null);
  };

  const onUserInvite = (userData: UserData) => {
    if (sendData === null) return

    sendData(RoomSocketActionType.INVITE, {
      action: "invite",
      targetId: Number(userData.id),
    } as PayloadAction);
    setAllUsers(allUsers.filter((allUser) => allUser.getUsername() !== userData.username));
  };

  const onUserClick = ({ event, userData }: UserClickParameters) => {
    if (invitedUsername === null) {
      setButtonClicked(event.button);
    } else {
      onUserInvite(userData);
    }

    setChannelUserClicked(createChannelUser(userData, channelData));
  };

  const filter = (userName: string, searchText: string): boolean => {
    return activeUserName !== userName && userName.includes(searchText)
  }

  return (
    <div className="popup-container">
      <Popup className="channel-users-popup">
        <input
          className="filter-users"
          type="search"
          placeholder="Chercher un utilisateur"
          value={searchText}
          onFocus={(e) => onSearching("", 0)}
          onChange={(e) => onSearching(e.target.value, 0)}
        />
        {invitedUsername !== null
          ? <UsersList
            users={allUsers.filter(user => channelData.usersId.find(userId => parseInt(user.getId()) === userId) === undefined)}
            filter={(userName) => filter(userName.toLowerCase(), invitedUsername.toLowerCase())}
            onUserClick={onUserClick}
          />
          : <ChannelUsersList
            users={channelUsers}
            filter={(userName) => filter(userName.toLowerCase(), searchText.toLowerCase())}
            onUserClick={onUserClick}
          />
        }
        {channelData.type === ChannelType.PRIVATE
          ?
          <input
            className="invite-user"
            type="search"
            placeholder="Inviter quelqu'un"
            value={invitedUsername === null ? "" : invitedUsername}
            onFocus={(e) => onSearching("", 1)}
            onChange={(e) => onSearching(e.target.value, 1)}
            required
          />
          : undefined}
      </Popup>

      {channelUserClicked !== null ?
        <UserActionPopup
          userData={channelUserClicked}
          buttonClicked={buttonClicked}
          isAdmin={channelUserClicked.role === ChannelUserRole.ADMIN}
          isBanned={channelUserClicked.banned}
          isMuted={channelUserClicked.muted}
        />
      : undefined}
    </div>
  );
}
