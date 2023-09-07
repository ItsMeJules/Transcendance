import { UserData } from "services/User/User";

export type UserClickParameters = {
  event: React.MouseEvent<HTMLDivElement, MouseEvent>;
  userData: UserData;
};

type UserComponentProps = {
  userData: UserData;
  onUserClick?: (params: UserClickParameters) => void;
};

export default function UserComponent({
  userData,
  onUserClick = (params: UserClickParameters) => {},
}: UserComponentProps) {
  return (
    <div
      onAuxClick={(event) => onUserClick({ event, userData })}
      onClick={(event) => onUserClick({ event, userData })}
      className="user-container"
    >
      <div className="user">
        <img
          className="profile-picture"
          src={userData.profilePicture === null ? "" : userData.profilePicture}
          alt="Profile"
        />
        <p className="username">{userData.username}</p>
      </div>
    </div>
  );
}
