import { ChannelUser, ChannelUserRole } from "pages/ChatBox/models/Channel";
import { UserData } from "services/User/User";
import { UserClickParameters } from "./UserComponent";

type ChannelUserComponentProps = {
  channelUser: ChannelUser;
  onUserClick?: (params: UserClickParameters) => void;
};

export default function ChannelUserComponent({
  channelUser,
  onUserClick = (params: UserClickParameters) => {},
}: ChannelUserComponentProps) {
  let AdminBadge = require("../../assets/admin-badge.png");
  let OwnerBadge = require("../../assets/owner.png");

  const badgeImgSrc =
    channelUser.role === ChannelUserRole.OWNER
      ? OwnerBadge
      : channelUser.role === ChannelUserRole.ADMIN
      ? AdminBadge
      : null;
  const userData = channelUser as UserData;

  return (
    <div
      className="user-container"
      onAuxClick={(event) => onUserClick({ event, userData })}
      onClick={(event) => onUserClick({ event, userData })}
    >
      <div className="user">
        <img
          className="profile-picture"
          src={channelUser.profilePicture === null ? "" : channelUser.profilePicture}
          alt="Profile"
          style={{ border: "1px solid " + (channelUser.isOnline ? "lime" : "red") }}
        />
        <p className="username">{channelUser.username}</p>
        {badgeImgSrc !== null ? (
          <img className="role-picture" src={badgeImgSrc} alt="role-img" />
        ) : undefined}
      </div>
    </div>
  );
}
