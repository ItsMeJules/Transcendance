import { useContext } from "react";
import { UserData } from "services/User/User";
import { useAppSelector } from "utils/redux/Store";
import { SendDataContext } from "pages/ChatBox/ChatBox";
import PayloadAction from "pages/ChatBox/models/PayloadSocket";
import {
  ChatSocketActionType,
  RoomSocketActionType,
} from "pages/ChatBox/models/TypesActionsEvents";
import Popup from "pages/ChatBox/utils/Popup";

interface UserActionProps {
  userData: UserData;
  buttonClicked: number;
  channelInvite: boolean;
  isMuted?: boolean;
  isAdmin?: boolean;
}

export default function UserActionPopup({
  userData,
  buttonClicked,
  channelInvite,
  isMuted = false,
  isAdmin = false,
}: UserActionProps) {
  const { id: currentIdUser, blockedUsers } = useAppSelector((store) => store.user.userData);
  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext);
  const isBlocked = blockedUsers.some((id) =>
    userData.id === null ? false : id === parseInt(userData.id)
  );

  const onBan = () => {
    if (sendData === null) return;

    sendData(RoomSocketActionType.BAN, {
      action: "ban",
      targetId: Number(userData.id),
    } as PayloadAction);
  };

  const onKick = () => {
    if (sendData === null) return;

    sendData(RoomSocketActionType.KICK, {
      action: "kick",
      targetId: Number(userData.id),
    } as PayloadAction);
  };

  const onMute = () => {
    if (sendData === null) return;

    sendData(RoomSocketActionType.MUTE, {
      action: "mute",
      targetId: Number(userData.id),
    } as PayloadAction);
  };

  const onPromote = () => {
    if (sendData === null) return;

    sendData(RoomSocketActionType.PROMOTE, {
      action: "promote",
      targetId: Number(userData.id),
    } as PayloadAction);
  };

  const onDm = () => {
    if (sendData === null) return;
    if (currentIdUser === undefined) return;
    if (currentIdUser === userData.id) return; // Can't send DM to yourself
    if (userData.id === null) return;

    const roomNameDm =
      "dm-" +
      (parseInt(currentIdUser!) > parseInt(userData.id)
        ? currentIdUser + "-" + Number(userData.id)
        : Number(userData.id) + "-" + Number(currentIdUser));

    sendData(ChatSocketActionType.CREATE_CHANNEL, {
      action: ChatSocketActionType.CREATE_CHANNEL,
      type: "DIRECT",
      roomName: roomNameDm,
    } as PayloadAction);
  };

  const onInviteChannel = () => {
    if (sendData === null) return;

    sendData(RoomSocketActionType.INVITE, {
      action: "invite",
      targetId: Number(userData.id),
    } as PayloadAction);
  };

  const onInviteToPlay = () => {
    if (sendData === null) return;

    sendData(ChatSocketActionType.INVITE_TO_PLAY, {
      action: "inviteToPlay",
      targetId: Number(userData.id),
    } as PayloadAction);
  };

  const onBlock = () => {
    if (sendData === null) return;

    sendData(ChatSocketActionType.BLOCK, {
      action: "block",
      targetId: Number(userData.id),
    } as PayloadAction);
  };

  return (
    <Popup className="user-actions">
      <h4>{userData.username}</h4>
      {buttonClicked === 1 ? (
        <>
          <div className="ban" onClick={onBan}>
            Ban
          </div>
          <div className="kick" onClick={onKick}>
            Kick
          </div>
          <div className={isMuted ? "mute" : "unmute"} onClick={onMute}>
            {isMuted ? "Un/mute" : "Un/mute"}
          </div>
          <div className={isAdmin ? "demote" : "promote"} onClick={onPromote}>
            {isAdmin ? "Remove from admins" : "Add to admins"}
          </div>
        </>
      ) : buttonClicked === 0 ? (
        <>
          <div className="dm" onClick={onDm}>
            Send a dm
          </div>
          <div className="invite-to-play" onClick={onInviteToPlay}>
            Invite to play
          </div>
          {channelInvite ? (
            <div className="invite-to-channel" onClick={onInviteChannel}>
              Invite in the channel
            </div>
          ) : undefined}
          <div
            className={isBlocked === true ? "block-user" : "unblock-user"}
            onClick={onBlock}
          >
            {isBlocked === true ? "Unblock" : "Block"}
          </div>
        </>
      ) : undefined}
    </Popup>
  );
}
