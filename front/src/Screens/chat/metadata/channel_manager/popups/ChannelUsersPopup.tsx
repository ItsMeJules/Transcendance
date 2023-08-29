import { useContext, useEffect, useState } from "react";

import User from "../../../../../Services/User";
import { useWebsocketContext } from "../../../../../Wrappers/Websocket";
import { SendDataContext } from "../../../ChatBox";
import PayloadAction from "../../../models/PayloadSocket";
import { RoomSocketActionType } from "../../../models/TypesActionsEvents";
import Popup from "../../../utils/Popup";
import { UserClickParameters } from "../../../utils/UserComponent";
import UsersList from "../../../utils/UsersList";
import UserActionPopup from "../../../utils/UserActionPopup";
import { fetchAllUsers } from "../../more/popups/AllUsersPopup";
import { ChannelData, BanData, PunishmentType } from "../../../models/Channel";

interface ChannelUsersPopupProps {
  channelData: ChannelData;
}

export default function ChannelUsersPopup({ channelData }: ChannelUsersPopupProps) {
  const [searchText, setSearchText] = useState("");
  const [invitedUsername, setInvitedUsername] = useState<string>("")
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [invited, setInvited] = useState(false)

  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext);
  const chatSocket = useWebsocketContext().chat;
  const [channelUsers, setChannelUsers] = useState<User[]>([])

  const [userClicked, setUserClicked] = useState<User | null>(null)
  const [buttonClicked, setButtonClicked] = useState<number>(-1)

  let isUserClickedMuted = false;
  let isUserClickedBanned = false;
  let isUserClickedAdmin = false;
  let isUserClickedBlocked = false;

  useEffect(() => {
    chatSocket?.on(RoomSocketActionType.USERS_ON_ROOM, (payload: any) => {
      const fetchedUsers = payload.users.map((userData: any) => {
        const frontUser = new User();
        console.log(userData)

        frontUser.setUserFromResponseData(userData);

        return frontUser;
      });

      setChannelUsers(fetchedUsers);
    });

    return () => {
      chatSocket?.off(RoomSocketActionType.USERS_ON_ROOM);
    };
  }, [chatSocket]);

  useEffect(() => {
    if (sendData === null)
      return

    sendData(RoomSocketActionType.USERS_ON_ROOM, {
      roomName: channelData.name,
      action: "getRoomUsers"
    } as PayloadAction)
  }, [sendData, channelData.name])

  useEffect(() => {
    if (invited === false)
      return

    setTimeout(() => {
      setUserClicked(null)
      setInvited(false)
    }, 2000);
  }, [invited])

  const onSearching = async (text: string, inputId: number) => {
    if (inputId === 0) {
      if (invitedUsername.length !== 0)
        setInvitedUsername("")

      setSearchText(text)
    } else {
      if (searchText.length !== 0)
        setSearchText("")

      if (allUsers.length === 0)
        setAllUsers(await fetchAllUsers())

      setInvitedUsername(text)
    }
    setButtonClicked(-1)
    setUserClicked(null)
  }

  const onUserInvite = (user: User) => {
    setAllUsers(allUsers.filter(allUser => allUser.getUsername() !== user.getUsername()))
    setInvited(true)
  }

  const onUserClick = ({ event, user }: UserClickParameters) => {
    if (invitedUsername.length === 0) {
      setButtonClicked(event.button)
    } else {
      onUserInvite(user)
    }

    const userId = parseInt(user.getId())
    isUserClickedAdmin = channelData.adminsId?.find(id => userId) !== null
    channelData.punishments.forEach(punishment => {
      if (punishment.userId === userId) {
        isUserClickedBanned = punishment.type === PunishmentType.BAN
        isUserClickedMuted = punishment.type === PunishmentType.MUTE
      }
    })
    setUserClicked(user)
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

        <UsersList
          users={invitedUsername.length !== 0 ? allUsers : channelUsers}
          filter={(userName) => userName.toLowerCase().includes(invitedUsername.length !== 0 ? invitedUsername.toLowerCase() : searchText.toLowerCase())}
          onUserClick={onUserClick}
        />
        <input
          className="invite-user"
          type="search"
          placeholder="Inviter quelqu'un"
          value={invitedUsername}
          onChange={(e) => onSearching(e.target.value, 1)}
          required
        />
      </Popup>
      {userClicked !== null
        ? invited !== false
          ? (<div className="invited">{userClicked.getUsername()} a été invité !</div>)
          : (<UserActionPopup
              user={userClicked}
              buttonClicked={buttonClicked}
              isMuted={isUserClickedMuted}
              isBanned={isUserClickedBanned}
              isAdmin={isUserClickedAdmin}
              isBlocked={isUserClickedBlocked}
            />)
        : undefined}
    </div>
  )
}