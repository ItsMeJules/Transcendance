import User from "../../../../../../Services/User";
import Popup from "../../../../utils/Popup";

interface UserActionProps {
  rect: DOMRect
  user: User
}

export default function UserActionPopup(props: UserActionProps) {
  const { rect, user } = props;

  const style = {
    top: rect.y + "px",
    left: rect.x + rect.width + "px",
  }

  return (
    <Popup className="user-actions" style={style}>
      <div className="ban">Bannir</div>
      <div className="kick">Expulser</div>

      <div className="mute">
        Rendre muet
      </div>
    </Popup>
  )
}