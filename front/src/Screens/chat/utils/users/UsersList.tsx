import User from "../../../../Services/User";
import UserComponent, { UserClickParameters } from "./UserComponent";

interface UsersListProps {
  users: User[];
  filter?: (text: string) => boolean;
  onUserClick?: (user: UserClickParameters) => void;
}

export default function UsersList(props: UsersListProps) {
  const { users, filter = (string) => true, onUserClick = (user) => {} } = props;

  const handleSubmit = (target: number) => {
    // let payload?: PayloadAction = { action: "noMatch", targetId: target };
    // if (inputValue === "") return;
    // switch (inputValue) {
    //   case "block":
    //     payload = { ...payload, action: "block" };
    //     break;
    //   case "unblock":
    //     payload = { ...payload, action: "unblock" };
    //     break;
    //   case "ban":
    //     payload = { ...payload, action: "ban" };
    //     break;
    //   case "unban":
    //     payload = { ...payload, action: "unban" };
    //     break;
    //   case "promote":
    //     payload = { ...payload, action: "promote" };
    //     break;
    //   case "demote":
    //     payload = { ...payload, action: "demote" };
    //     break;
    //   case "mute":
    //     payload = { ...payload, action: "mute" };
    //     break;
    //   case "unmute":
    //     payload = { ...payload, action: "unmute" };
    //     break;
    //   case "kick":
    //     payload = { ...payload, action: "kick" };
    //     break;
    //   case "invite":
    //     payload = { ...payload, action: "invite" };
    //     break;
    //   default:
    // }
    // console.log("coquin");
    // sendData && sendData(payload.action, payload);
    // setInputValue("");
    // setSelectedUser(null);
  };

  // const handleKeyPress = (event: React.KeyboardEvent, target: number) => {
  //   if (event.key === "Enter") {
  //     handleSubmit(target);
  //   }
  // };

  return (
    <div className="users-list">
      {users.map((user, key) => {
        const userData = user.getData()
        
        if (userData === null) return undefined;
        if (!filter(user.getUsername())) return undefined;
        
        return <UserComponent userData={userData} onUserClick={onUserClick} />;
      })}
    </div>
  );
}
