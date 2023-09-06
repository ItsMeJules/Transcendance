import { ChannelUser } from "pages/ChatBox/models/Channel";
import ChannelUserComponent from "./ChannelUserComponent";
import { UserClickParameters } from "./UserComponent";

interface ChannelUsersListProps {
  users: ChannelUser[];
  filter?: (text: string) => boolean;
  onUserClick?: (user: UserClickParameters) => void;
}

export default function ChannelUsersList(props: ChannelUsersListProps) {
  const { users, filter = (string) => true, onUserClick = (user) => {} } = props;

  return (
    <div className="users-list">
      {users.map((user) => {
        if (user.username !== null && !filter(user.username)) return undefined;

        return (
          <ChannelUserComponent key={user.id} channelUser={user} onUserClick={onUserClick} />
        );
      })}
    </div>
  );
}
