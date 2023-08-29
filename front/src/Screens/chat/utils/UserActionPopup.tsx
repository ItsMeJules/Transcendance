import { useContext } from "react";

import User from "../../../Services/User";
import { SendDataContext } from "../ChatBox";
import PayloadAction from "../models/PayloadSocket";
import { ChatSocketActionType, RoomSocketActionType } from "../models/TypesActionsEvents";
import Popup from "./Popup";
import { useAppSelector } from "../../../redux/Store";

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
  const {
    user,
    buttonClicked,
    isMuted = false,
    isBanned = false,
    isAdmin = false,
    isBlocked = false,
  } = props;

  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext);

  const onBan = (ban: boolean) => {
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
    if (sendData === null) return;

    sendData(RoomSocketActionType.MUTE, {
      action: "mute",
      targetId: Number(props.user.getId()),
    } as PayloadAction);
  };

  const onPromote = (promote: boolean) => {
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
    if (sendData === null) return;

    sendData(ChatSocketActionType.BLOCK, {
      action: "block",
      targetId: Number(props.user.getId()),
    } as PayloadAction);
  };

  return (
    <Popup className="user-actions">
      <h4>{user.getUsername()}</h4>
      {buttonClicked === 1 ? (
        <>
          {isBanned === true ? (
            <div className="ban" onClick={() => onBan(true)}>
              Bannir
            </div>
          ) : (
            <div className="unban" onClick={() => onBan(false)}>
              Débannir
            </div>
          )}

          <div className="kick" onClick={() => onKick}>
            Expulser
          </div>

          {isMuted === true ? (
            <div className="mute" onClick={() => onMute(true)}>
              Rendre muet
            </div>
          ) : (
            <div className="unmute" onClick={() => onMute(false)}>
              Rendre la parole
            </div>
          )}

          {isAdmin === true ? (
            <div className="promote" onClick={() => onPromote(true)}>
              Définir administrateur
            </div>
          ) : (
            <div className="demote" onClick={() => onPromote(false)}>
              Supprimer des administrateurs
            </div>
          )}
        </>
      ) : buttonClicked === 0 ? (
        <>
          <div className="dm" onClick={onDm}>
            Envoyer un message privé
          </div>
          <div className="invite-to-play" onClick={onInvite}>
            Inviter à jouer
          </div>
          {isBlocked === true ? (
            <div className="block-user" onClick={() => onBlock(true)}>
              Bloquer
            </div>
          ) : (
            <div className="unblock-user" onClick={() => onBlock(false)}>
              Débloquer
            </div>
          )}
        </>
      ) : undefined}
    </Popup>
  );
}
