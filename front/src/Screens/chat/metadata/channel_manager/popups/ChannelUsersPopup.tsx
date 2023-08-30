import { useContext, useEffect, useState } from "react";

import User, { UserData } from "../../../../../Services/User";
import { useWebsocketContext } from "../../../../../Wrappers/Websocket";
import { SendDataContext } from "../../../ChatBox";
import { ChannelData, ChannelUser, createChannelUser } from "../../../models/Channel";
import PayloadAction from "../../../models/PayloadSocket";
import { RoomSocketActionType } from "../../../models/TypesActionsEvents";
import Popup from "../../../utils/Popup";
import UserActionPopup from "../../../utils/users/UserActionPopup";
import { UserClickParameters } from "../../../utils/users/UserComponent";
import { fetchAllUsers } from "../../more/popups/AllUsersPopup";
import UsersList from "../../../utils/users/UsersList";
import ChannelUsersList from "../../../utils/users/ChannelUsersList";
import { useAppSelector } from "../../../../../redux/Store";

interface ChannelUsersPopupProps {
  channelData: ChannelData;
}

export default function ChannelUsersPopup({ channelData }: ChannelUsersPopupProps) {
  const [searchText, setSearchText] = useState("");
  const [invitedUsername, setInvitedUsername] = useState<string>("");
  const [invited, setInvited] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const { username: activeUserName } = useAppSelector(store => store.user.userData)

  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext);
  const chatSocket = useWebsocketContext().chat;
  const [channelUsers, setChannelUsers] = useState<ChannelUser[]>([]);

  const [channelUserClicked, setChannelUserClicked] = useState<ChannelUser | null>(null);
  const [buttonClicked, setButtonClicked] = useState<number>(-1);

  useEffect(() => {
    chatSocket?.on(RoomSocketActionType.USERS_ON_ROOM, (payload: any) => {
      setChannelUsers(
        payload.users.map((userData: UserData) => createChannelUser(userData, channelData)));
    });

    return () => {
      chatSocket?.off(RoomSocketActionType.USERS_ON_ROOM);
    };
  }, [chatSocket, channelData]);

  useEffect(() => {
    if (sendData === null) return;

    sendData(RoomSocketActionType.USERS_ON_ROOM, {
      roomName: channelData.name,
      action: "getRoomUsers",
    } as PayloadAction);
  }, [sendData, channelData.name]);

  useEffect(() => {
    if (invited === false) return;

    setTimeout(() => {
      setChannelUserClicked(null);
      setInvited(false);
    }, 2000);
  }, [invited]);

  const onSearching = async (text: string, inputId: number) => {
    if (inputId === 0) {
      if (invitedUsername.length !== 0) setInvitedUsername("");

      setSearchText(text);
    } else {
      if (searchText.length !== 0) setSearchText("");
      if (allUsers.length === 0) setAllUsers(await fetchAllUsers());

      setInvitedUsername(text);
    }
    setButtonClicked(-1);
    setChannelUserClicked(null);
  };

  const onUserInvite = (userData: UserData) => {
    setAllUsers(allUsers.filter((allUser) => allUser.getUsername() !== userData.username));
    setInvited(true);
  };

  const onUserClick = ({ event, userData }: UserClickParameters) => {
    if (invitedUsername.length === 0) {
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
          onChange={(e) => onSearching(e.target.value, 0)}
        />
        {invitedUsername.length !== 0
          ? <UsersList
              users={allUsers}
              filter={(userName) => filter(userName, invitedUsername.toLowerCase())}
              onUserClick={onUserClick}
            />
          : <ChannelUsersList
              users={channelUsers}
              filter={(userName) => filter(userName, searchText.toLowerCase())}
              onUserClick={onUserClick}
            />
        }
        <input
          className="invite-user"
          type="search"
          placeholder="Inviter quelqu'un"
          value={invitedUsername}
          onChange={(e) => onSearching(e.target.value, 1)}
          required
        />
      </Popup>

      {channelUserClicked !== null ? (
        invited !== false ? (
          <div className="invited">{channelUserClicked.username} a été invité !</div> // ??
        ) : (
          <UserActionPopup
            userData={channelUserClicked}
            buttonClicked={buttonClicked}
          />
        )
      ) : undefined}
    </div>
  );
}
