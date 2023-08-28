import User from "../../../../../../Services/User";
import Popup from "../../../../utils/Popup";

interface UserActionProps {
  user: User
  buttonClicked: number
}

export default function UserActionPopup(props: UserActionProps) {
  const { user, buttonClicked } = props;

  return (
    <Popup className="user-actions">
      <h4>{user.getUsername()}</h4>
      {buttonClicked === 1
        ? (
          <>
            <div className="ban">Bannir</div>
            <div className="kick">Expulser</div>
            <div className="mute">Rendre muet</div>
          </>
        )
        : buttonClicked === 0 ? (
          <>
            <div className="dm">Envoyer un message privé</div>
            <div className="invite-to-play">Inviter à jouer</div>
          </>
        ) : undefined}
    </Popup>
  )
}