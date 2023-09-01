import { useContext, useEffect, useState } from "react";
import User, { UserData } from "../../../../../Services/User";
import { useWebsocketContext } from "../../../../../Wrappers/Websocket";
import { SendDataContext } from "../../../ChatBox";
import { ChannelData } from "../../../models/Channel";
import PayloadAction from "../../../models/PayloadSocket";
import { RoomSocketActionType } from "../../../models/TypesActionsEvents";
import { UserClickParameters } from "../../../utils/users/UserComponent";
import UsersList from "../../../utils/users/UsersList";

interface BannedUsersPopupProps {
  channelData: ChannelData;
}

export default function BannedUsersPopup({ channelData }: BannedUsersPopupProps) {
  const chatSocket = useWebsocketContext().chat;
  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext);

  const [bannedUsers, setBannedUsers] = useState<User[]>([])
  const [userClicked, setUserClicked] = useState<UserData | null>(null);

  // Parses all the users banned in the room
  useEffect(() => {
    chatSocket?.on(RoomSocketActionType.USERS_BANNED, (payload: any) => setBannedUsers(payload.users));

    return () => {
      chatSocket?.off(RoomSocketActionType.USERS_BANNED);
    };
  }, [chatSocket, channelData]);

  // Triggers the request for users banned in the room
  useEffect(() => {
    if (sendData === null) return;

    sendData(RoomSocketActionType.USERS_BANNED, {
      roomName: channelData.name,
      action: "getBannedUsers",
    } as PayloadAction);
  }, [sendData, channelData]);

  const onUserClick = ({ event, userData }: UserClickParameters) => {
    setUserClicked(userData)
  }

  const unBan = () => {
    if (sendData === null || userClicked === null|| userClicked.id === null) return
    
    sendData(RoomSocketActionType.UNBAN, {
      action: "unban",
      targetId: parseInt(userClicked.id)
    } as PayloadAction)
  }

  return (
    <div className="users-list-banned">
      <UsersList users={bannedUsers} onUserClick={onUserClick} />
      {userClicked !== null ?
        <div className="unban-confirm">
          <button onClick={() => unBan()}>
            {`Débannir ${userClicked.username} ?`}
          </button>
        </div>
        : undefined}
    </div>
  )
}