import User from "services/User/User";

export type UserClickParameters = {
  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  user: User
}

type UserComponentProps = {
  user: User
  onUserClick?: (params: UserClickParameters) => void
}

export default function UserComponent({ user, onUserClick = (params: UserClickParameters) => { } }: UserComponentProps) {
  return (
    <div onAuxClick={(event) => onUserClick({ event, user })} onClick={(event) => onUserClick({ event, user })} className="user-container">
      <div className="user">
        <img className="profile-picture" src={user.getProfilePicture()} alt="Profile"
          style={{ border: "1px solid " + (user.getIsOnline() ? "lime" : "red") }} />
        <p className="username">{user.getUsername()}</p>
      </div>
    </div>
  )
}