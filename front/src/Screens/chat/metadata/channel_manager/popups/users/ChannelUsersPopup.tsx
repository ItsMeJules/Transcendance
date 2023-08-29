import { useContext, useEffect, useState } from "react";

import User from "../../../../../../Services/User";
import { useWebsocketContext } from "../../../../../../Wrappers/Websocket";
import { SendDataContext } from "../../../../ChatBox";
import PayloadAction from "../../../../models/PayloadSocket";
import { RoomSocketActionType } from "../../../../models/TypesActionsEvents";
import Popup from "../../../../utils/Popup";
import { UserClickParameters } from "../../../../utils/UserComponent";
import UsersList from "../../../../utils/UsersList";
import UserActionPopup from "./UserActionPopup";

interface ChannelUsersPopupProps {
  roomName: string
}

export default function ChannelUsersPopup({ roomName }: ChannelUsersPopupProps) {
  const [searchText, setSearchText] = useState("");

  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext); 
  const chatSocket = useWebsocketContext().chat;
  const [users, setUsers] = useState<User[]>([])

  const [userClicked, setUserClicked] = useState<User | null>(null)
  const [buttonClicked, setButtonClicked] = useState<number>(-1)

  useEffect(() => {
    chatSocket?.on(RoomSocketActionType.USERS_ON_ROOM, (payload: any) => {
      const fetchedUsers = payload.users.map((userData: any) => {
        const frontUser = new User();

        frontUser.setUserFromResponseData(userData);

        return frontUser;
      });

      setUsers(fetchedUsers);
    });

    return () => {
      chatSocket?.off(RoomSocketActionType.USERS_ON_ROOM);
    };
  }, [chatSocket]);

  useEffect(() => {
    if (sendData === null)
      return

    sendData(RoomSocketActionType.USERS_ON_ROOM, {
      roomName: roomName,
      action: "getRoomUsers"
    } as PayloadAction)
  }, [sendData, roomName])

  const onUserClick = ({ event, user }: UserClickParameters) => {
    setButtonClicked(event.button)
    setUserClicked(user)
  }

  const handleClickInvite = () => {
  }

  return (
    <div className="popup-container">
      <Popup className="channel-users-popup">
        <input
          className="filter-users"
          type="search"
          placeholder="Chercher un utilisateur"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <UsersList
          users={users}
          filter={(userName) => userName.includes(searchText)}
          onUserClick={onUserClick}
        />
      </Popup>
      <div onClick={handleClickInvite} className="invite-user">
        Inviter quelqu'un
      </div>
      {userClicked !== null
        ? <UserActionPopup
            user={userClicked}
            buttonClicked={buttonClicked}
          />
        : undefined}

    </div>
  )
}