import User from "../../../Services/User";

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
    <div onClick={(event) => onUserClick({ event, user })} className="user-container">
      <div className="user">
        <img className="profile-picture" src={user.getProfilePicture()} alt="Profile"
          style={{ border: "1px solid " + (user.getIsOnline() ? "lime" : "red") }} />
        <p className="username">{user.getUsername()}</p>
      </div>
    </div>
  )
}