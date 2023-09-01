import { useContext } from "react";
import { UserData } from "../../../../Services/User";
import { useAppSelector } from "../../../../redux/Store";
import { SendDataContext } from "../../ChatBox";
import PayloadAction from "../../models/PayloadSocket";
import { ChatSocketActionType, RoomSocketActionType } from "../../models/TypesActionsEvents";
import Popup from "../Popup";

interface UserActionProps {
  userData: UserData;
  buttonClicked: number;
  channelInvite: boolean;
  isMuted?: boolean;
  isBanned?: boolean;
  isAdmin?: boolean;
  isBlocked?: boolean;
}

export default function UserActionPopup({ userData, buttonClicked, channelInvite, isMuted = false, isBanned = false, isAdmin = false, isBlocked = false }: UserActionProps) {
  const { id: currentIdUser } = useAppSelector((store) => store.user.userData);

  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext);

  const onBan = (ban: boolean) => {
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

  const onMute = (mute: boolean) => {
    if (sendData === null) return;

    sendData(RoomSocketActionType.MUTE, {
      action: "mute",
      targetId: Number(userData.id),
    } as PayloadAction);
  };

  const onPromote = (promote: boolean) => {
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
  };

  const onBlock = (block: boolean) => {
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
          {isBanned ? (
            <div className="ban" onClick={() => onBan(!isBanned)}>
              Bannir
            </div>
          ) : (
            <div className="unban" onClick={() => onBan(!isBanned)}>
              Débannir
            </div>
          )}

          <div className="kick" onClick={() => onKick()}>
            Expulser
          </div>

          {isMuted ? (
            <div className="mute" onClick={() => onMute(!isMuted)}>
              Rendre muet
            </div>
          ) : (
            <div className="unmute" onClick={() => onMute(!isMuted)}>
              Rendre la parole
            </div>
          )}

          {!isAdmin ? (
            <div className="promote" onClick={() => onPromote(!isAdmin)}>
              Définir administrateur
            </div>
          ) : (
            <div className="demote" onClick={() => onPromote(!isAdmin)}>
              Supprimer des administrateurs
            </div>
          )}
        </>
      ) : buttonClicked === 0 ? (
        <>
          <div className="dm" onClick={onDm}>
            Envoyer un message privé
          </div>
          <div className="invite-to-play" onClick={onInviteToPlay}>
            Inviter à jouer
          </div>
          {channelInvite
            ?
              <div className="invite-to-channel" onClick={onInviteChannel}>
                Inviter dans le channel
              </div>
            : undefined}
          {isBlocked === true ? (
            <div className="block-user" onClick={() => onBlock(!isBlocked)}>
              Bloquer
            </div>
          ) : (
            <div className="unblock-user" onClick={() => onBlock(!isBlocked)}>
              Débloquer
            </div>
          )}
        </>
      ) : undefined}
    </Popup>
  );
}
