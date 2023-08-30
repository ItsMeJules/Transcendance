import { UserData } from "../../../../Services/User"

export type UserClickParameters = {
  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  userData: UserData
}

type UserComponentProps = {
  userData: UserData
  onUserClick?: (params: UserClickParameters) => void
}

export default function UserComponent({ userData, onUserClick = (params: UserClickParameters) => { } }: UserComponentProps) {
  return (
    <div onAuxClick={(event) => onUserClick({ event, userData })} onClick={(event) => onUserClick({ event, userData })} className="user-container">
      <div className="user">
        <img className="profile-picture" src={userData.profilePicture === null ? "" : userData.profilePicture} alt="Profile"
          style={{ border: "1px solid " + (userData.isOnline ? "lime" : "red") }} />
        <p className="username">{userData.username}</p>
      </div>
    </div>
  )
}