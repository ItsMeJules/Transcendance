import Popup from "../../../utils/Popup"
import UsersList from "../../../utils/UsersList";

export default function RestrictUserPopup() {
  return (
    <Popup className="restrict-popup">
        <UsersList />
    </Popup>
  )
}