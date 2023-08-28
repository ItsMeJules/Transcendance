import User from "../../../Services/User";
import UserComponent, { UserClickParameters } from "./UserComponent";

interface UsersListProps {
  users: User[]
  filter?: (text: string) => boolean
  onUserClick?: (user: UserClickParameters) => void
}

export default function UsersList(props: UsersListProps) {
  const {
    users,
    filter = (string) => true,
    onUserClick = (user) => { },
  } = props;

  return (
    <div className="users-list">
      {users.map((user, key) => {
        if (!filter(user.getUsername()))
          return undefined
          
        return <UserComponent user={user} onUserClick={onUserClick} />
      })}
    </div>
  )
}