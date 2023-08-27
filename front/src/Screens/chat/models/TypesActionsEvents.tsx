export enum ChatSocketEventType {
  JOIN_ROOM = "join-room",
  MESSAGE = "message",
  CHAT_ACTION = "chat-action",
  ROOM_ACTION = "room-action",
}

export enum ChatSocketActionType {
  BLOCK = "block",
  UNBLOCK = "unblock",
  CREATE_CHANNEL = "createRoom",
  FETCH_HISTORY = "fetchHistory",
  SWITCH_CHANNEL = "joinRoom",
}

export enum RoomSocketActionType {
  LEAVE_ROOM = "leaveRoom",
  BAN = "ban",
  UNBAN = "unban",
  PROMOTE = "promote",
  DEMOTE = "demote",
  MUTE = "mute",
  UNMUTE = "unmute",
  KICK = "kick",
  CHANGE_PASSWORD = "change-password",
  INVITE = "invite",
}
