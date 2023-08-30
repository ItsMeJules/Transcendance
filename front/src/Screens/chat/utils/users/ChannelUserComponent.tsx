import { ChannelUser, ChannelUserRole } from "../../models/Channel"

import AdminBadge from "../../assets/admin-badge.png"
import OwnerBadge from "../../assets/owner.png"
import { UserClickParameters } from "./UserComponent"
import { UserData } from "../../../../Services/User"

type ChannelUserComponentProps = {
  channelUser: ChannelUser
  onUserClick?: (params: UserClickParameters) => void
}

export default function ChannelUserComponent(
  { channelUser, onUserClick = (params: UserClickParameters) => { } }: ChannelUserComponentProps) {
  const badgeImgSrc = channelUser.role === ChannelUserRole.OWNER
    ? OwnerBadge
    : channelUser.role === ChannelUserRole.ADMIN
      ? AdminBadge
      : null
  const userData = channelUser as UserData;

  return (
    <div className="user-container"
      onAuxClick={(event) => onUserClick({ event, userData })}
      onClick={(event) => onUserClick({ event, userData })}
    >
      <div className="user">
        <img className="profile-picture"
          src={channelUser.profilePicture === null ? "" : channelUser.profilePicture}
          alt="Profile"
          style={{ border: "1px solid " + (channelUser.isOnline ? "lime" : "red") }} />
        <p className="username">{channelUser.username}</p>
        {badgeImgSrc !== null
          ? (<img className="role-picture"
            src={badgeImgSrc}
            alt="role-img" />)
          : undefined}
      </div>
    </div>
  )
}