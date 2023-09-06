import User from "services/User/User";
import UserComponent, { UserClickParameters } from "./UserComponent";

interface UsersListProps {
  users: User[];
  filter?: (text: string) => boolean;
  onUserClick?: (user: UserClickParameters) => void;
}

export default function UsersList(props: UsersListProps) {
  const { users, filter = (string) => true, onUserClick = (user) => {} } = props;

  return (
    <div className="users-list">
      {users.map((user) => {
        const userData = user.getData();

        if (userData === null) return undefined;
        if (!filter(user.getUsername())) return undefined;

        return (
          <UserComponent key={user.getId()} userData={userData} onUserClick={onUserClick} />
        );
      })}
    </div>
  );
}
