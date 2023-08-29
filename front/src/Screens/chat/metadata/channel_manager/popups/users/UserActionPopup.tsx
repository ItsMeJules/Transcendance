import { useContext } from "react";

import User from "../../../../../../Services/User";
import { SendDataContext } from "../../../../ChatBox";
import PayloadAction from "../../../../models/PayloadSocket";
import { ChatSocketActionType, RoomSocketActionType } from "../../../../models/TypesActionsEvents";
import Popup from "../../../../utils/Popup";

interface UserActionProps {
  user: User
  buttonClicked: number
}

export default function UserActionPopup(props: UserActionProps) {
  const { user, buttonClicked } = props;

  const sendData: null | ((action: string, data: PayloadAction) => void) =
    useContext(SendDataContext); 

  const onBan = () => {
    if (sendData === null)
      return

    sendData(RoomSocketActionType.BAN, {} as PayloadAction)
  }

  const onKick = () => {
    if (sendData === null)
      return

    sendData(RoomSocketActionType.KICK, {} as PayloadAction)
  }

  const onMute = () => {
    if (sendData === null)
      return

    sendData(RoomSocketActionType.MUTE, {} as PayloadAction)
  }

  const onPromote = () => {
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

  const onBlock = () => {
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
            <div className="ban" onClick={onBan}>Bannir</div>
            <div className="kick" onClick={onKick}>Expulser</div>
            <div className="mute" onClick={onMute}>Rendre muet</div>
            <div className="promote" onClick={onMute}>Définir administrateur</div>
          </>
        )
        : buttonClicked === 0 ? (
          <>
            <div className="dm" onClick={onDm}>Envoyer un message privé</div>
            <div className="invite-to-play" onClick={onInvite}>Inviter à jouer</div>
            <div className="block-user" onClick={onBlock}>Bloquer</div>
          </>
        ) : undefined}
    </Popup>
  )
}