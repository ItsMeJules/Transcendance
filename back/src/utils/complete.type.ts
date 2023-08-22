import { Message, Room, User, Game } from '@prisma/client';

export type CompleteRoom = Room & {
  usersOnRoom: User[];
  users: User[];
  bans: User[];
  admins: User[];
  mutes: User[];
  messages: Message[];
};

export type CompleteUser = User & {
  friends: User[];
  friendsOf: User[];
  player1Games: Game[];
  player2Games: Game[];
  wonGames: Game[];
  lostGames: Game[];
  mutedRooms: Room[];
  adminRooms: Room[];
  activeRooms: Room[];
  ownedRooms: Room[];
  bannedRooms: Room[];
  messages: Message[];
  blockedUsers: User[];
  blockedByUser: User[];
};

export type MoreCompleteRoom = Room & {
  users: CompleteUser[];
  bans: CompleteUser[];
  admins: CompleteUser[];
  mutes: CompleteUser[];
  messages: Message[];
};

export type MoreCompleteUser = User & {
  friends: CompleteUser[];
  friendsOf: CompleteUser[];
  player1Games: Game[];
  player2Games: Game[];
  wonGames: Game[];
  lostGames: Game[];
  mutedRooms: CompleteRoom[];
  adminRooms: CompleteRoom[];
  activeRooms: CompleteRoom[];
  ownedRooms: CompleteRoom[];
  bannedRooms: CompleteRoom[];
  messages: Message[];
  mutedUsers: CompleteUser[];
  mutedByUser: CompleteUser[];
};
