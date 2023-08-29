import { useContext } from "react";

import User from "../../../Services/User";
import { SendDataContext } from "../ChatBox";
import PayloadAction from "../models/PayloadSocket";
import { ChatSocketActionType, RoomSocketActionType } from "../models/TypesActionsEvents";
import Popup from "./Popup";

interface UserActionProps {
  user: User
  buttonClicked: number
  isMuted?: boolean
  isBanned?: boolean
  isAdmin?: boolean
  isBlocked?: boolean
}

export default function UserActionPopup(props: UserActionProps) {
  const { user, buttonClicked, isMuted = false, isBanned = false, isAdmin = false, isBlocked = false } = props;

  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext);

  const onBan = (ban: boolean) => {
    if (sendData === null)
      return

    sendData(RoomSocketActionType.BAN, {} as PayloadAction)
  }

  const onKick = () => {
    if (sendData === null)
      return

    sendData(RoomSocketActionType.KICK, {} as PayloadAction)
  }

  const onMute = (mute: boolean) => {
    if (sendData === null)
      return

    sendData(RoomSocketActionType.MUTE, {} as PayloadAction)
  }

  const onPromote = (promote: boolean) => {
    if (sendData === null)
      return

    sendData(RoomSocketActionType.PROMOTE, {} as PayloadAction)
  }

  const onDm = () => {
    if (sendData === null)
      return
  }

  const onInvite = () => {
    if (sendData === null)
      return

    sendData(RoomSocketActionType.INVITE, {} as PayloadAction)
  }

  const onBlock = (block: boolean) => {
    if (sendData === null)
      return

    sendData(ChatSocketActionType.BLOCK, {} as PayloadAction)
  }

  return (
    <Popup className="user-actions">
      <h4>{user.getUsername()}</h4>
      {buttonClicked === 1
        ? (
          <>
            {isBanned === true
              ? <div className="ban" onClick={() => onBan(true)}>Bannir</div>
              : <div className="unban" onClick={() => onBan(false)}>Débannir</div>
            }
            
            <div className="kick" onClick={() => onKick}>Expulser</div>

            {isMuted === true
              ? <div className="mute" onClick={() => onMute(true)}>Rendre muet</div>
              : <div className="unmute" onClick={() => onMute(false)}>Rendre la parole</div>
            }

            {isAdmin === true
              ? <div className="promote" onClick={() => onPromote(true)}>Définir administrateur</div>
              : <div className="demote" onClick={() => onPromote(false)}>Supprimer des administrateurs</div>}
          </>
        )
        : buttonClicked === 0 ? (
          <>
            <div className="dm" onClick={onDm}>Envoyer un message privé</div>
            <div className="invite-to-play" onClick={onInvite}>Inviter à jouer</div>
            {isBlocked === true
              ? <div className="block-user" onClick={() => onBlock(true)}>Bloquer</div>
              : <div className="unblock-user" onClick={() => onBlock(false)}>Débloquer</div>
            }
          </>
        ) : undefined}
    </Popup>
  )
}