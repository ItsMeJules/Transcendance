export enum ChatSocketEventType {
  JOIN_ROOM = "join-room",
  FETCH_MESSAGES = "fetch-messages",
  MESSAGE = "message",
  CHAT_ACTION = "chat-action",
  ROOM_ACTION = "room-action",
  ERRORS = "errors",
  ACKNOWLEDGEMENTS = "acknowledgements",
  SUCCESS = "success",
}

export enum ChatSocketActionType {
  BLOCK = "block",
  UNBLOCK = "unblock",
  CREATE_CHANNEL = "createRoom",
  FETCH_HISTORY = "fetchHistory",
  SWITCH_CHANNEL = "joinRoom",
  LEAVE_ROOM = "leaveRoom",
  CHANGE_PASSWORD = "changePassword",
  INVITE_TO_PLAY = "inviteToPlay",
}

export enum RoomSocketActionType {
  BAN = "ban",
  UNBAN = "unban",
  PROMOTE = "promote",
  DEMOTE = "demote",
  MUTE = "mute",
  UNMUTE = "unmute",
  KICK = "kick",
  INVITE = "invite",
  INVITE_PLAY = "invite-play",
  USERS_ON_ROOM = "users-on-room",
  USERS_BANNED = "users-banned",
}
