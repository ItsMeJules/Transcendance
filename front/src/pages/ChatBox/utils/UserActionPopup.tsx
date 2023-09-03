import { useState, useEffect, useContext } from "react";

import User from "services/User/User";
import { SendDataContext } from "pages/ChatBox/ChatBox";
import PayloadAction from "pages/ChatBox/models/PayloadSocket";
import { ChatSocketActionType, RoomSocketActionType } from "pages/ChatBox/models/TypesActionsEvents";
import Popup from "./Popup";
import { useAppSelector } from "utils/redux/Store";

interface UserActionProps {
  user: User;
  buttonClicked: number;
  isMuted?: boolean;
  isBanned?: boolean;
  isAdmin?: boolean;
  isBlocked?: boolean;
}

export default function UserActionPopup(props: UserActionProps) {
  const { id: currentIdUser } = useAppSelector((store) => store.user.userData);
  // const {
  //   user,
  //   buttonClicked,
  //   isMuted = false,
  //   isBanned = false,
  //   isAdmin = false,
  //   isBlocked = false,
  // } = props; // ???
  const [localIsBanned, setLocalIsBanned] = useState(props.isBanned);
  const [localIsMuted, setLocalIsMuted] = useState(props.isMuted);
  const [localIsAdmin, setLocalIsAdmin] = useState(props.isAdmin);
  const [localIsBlocked, setLocalIsBlocked] = useState(props.isBlocked);

  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext);

  const onBan = (ban: boolean) => {
    setLocalIsBanned(ban);
    if (sendData === null) return;

    sendData(RoomSocketActionType.BAN, {
      action: "ban",
      targetId: Number(props.user.getId()),
    } as PayloadAction);
  };

  const onKick = () => {
    if (sendData === null) return;

    sendData(RoomSocketActionType.KICK, {
      action: "kick",
      targetId: Number(props.user.getId()),
    } as PayloadAction);
  };

  const onMute = (mute: boolean) => {
    setLocalIsMuted(mute);
    if (sendData === null) return;

    sendData(RoomSocketActionType.MUTE, {
      action: "mute",
      targetId: Number(props.user.getId()),
    } as PayloadAction);
  };

  const onPromote = (promote: boolean) => {
    console.log("isAdmin ==", localIsAdmin);
    console.log("promote ==", promote);
    setLocalIsAdmin(promote);
    console.log("isAdmin is now == ", localIsAdmin);
    if (sendData === null) return;

    sendData(RoomSocketActionType.PROMOTE, {
      action: "promote",
      targetId: Number(props.user.getId()),
    } as PayloadAction);
  };

  const onDm = () => {
    if (sendData === null) return;
    if (currentIdUser === undefined) return;
    if (currentIdUser === props.user.getId()) return; // Can't send DM to yourself
    const roomNameDm =
      "dm-" +
      (parseInt(currentIdUser!) > parseInt(props.user.getId())
        ? currentIdUser + "-" + Number(props.user.getId())
        : Number(props.user.getId()) + "-" + Number(currentIdUser));

    sendData(ChatSocketActionType.CREATE_CHANNEL, {
      action: ChatSocketActionType.CREATE_CHANNEL,
      type: "DIRECT",
      roomName: roomNameDm,
    } as PayloadAction);
  };

  const onInvite = () => {
    if (sendData === null) return;

    sendData(RoomSocketActionType.INVITE, {
      action: "invite",
      targetId: Number(props.user.getId()),
    } as PayloadAction);
  };

  const onBlock = (block: boolean) => {
    setLocalIsBlocked(block);
    if (sendData === null) return;

    sendData(ChatSocketActionType.BLOCK, {
      action: "block",
      targetId: Number(props.user.getId()),
    } as PayloadAction);
  };

  return (
    <Popup className="user-actions">
      <h4>{props.user.getUsername()}</h4>
      {props.buttonClicked === 1 ? (
        <>
          {localIsBanned === true ? (
            <div className="ban" onClick={() => onBan(!localIsBanned)}>
              Bannir
            </div>
          ) : (
            <div className="unban" onClick={() => onBan(!localIsBanned)}>
              Débannir
            </div>
          )}

          <div className="kick" onClick={() => onKick()}>
            Expulser
          </div>

          {localIsMuted === true ? (
            <div className="mute" onClick={() => onMute(!localIsMuted)}>
              Rendre muet
            </div>
          ) : (
            <div className="unmute" onClick={() => onMute(!localIsMuted)}>
              Rendre la parole
            </div>
          )}

          {localIsAdmin === true ? (
            <div className="promote" onClick={() => onPromote(!localIsAdmin)}>
              Définir administrateur
            </div>
          ) : (
            <div className="demote" onClick={() => onPromote(!localIsAdmin)}>
              Supprimer des administrateurs
            </div>
          )}
        </>
      ) : props.buttonClicked === 0 ? (
        <>
          <div className="dm" onClick={onDm}>
            Send private message
          </div>
          <div className="invite-to-play" onClick={onInvite}>
            Invite to play
          </div>
          {localIsBlocked === true ? (
            <div className="block-user" onClick={() => onBlock(!localIsBlocked)}>
              Block user
            </div>
          ) : (
            <div className="unblock-user" onClick={() => onBlock(!localIsBlocked)}>
              Unblock
            </div>
          )}
        </>
      ) : undefined}
    </Popup>
  );
}
