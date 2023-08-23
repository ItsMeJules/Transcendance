import Popup from "../../../utils/Popup"
import UsersList from "../../../utils/UsersList"

export default function DirectMessagePopup() {

  return (
    <Popup className="dm-popup">
        <UsersList />
    </Popup>
  )
}
