import { UserData } from "../../../services/User/User";

export enum ChannelType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  PROTECTED = "PROTECTED",
  DIRECT = "DIRECT",
}

export const ChannelTypeDescription = {
  PUBLIC: { name: "Public", desc: "Accessible to everyone" },
  PRIVATE: { name: "Private", desc: "Invite only." },
  PROTECTED: { name: "Protected", desc: "Password protected." },
  DIRECT: { name: undefined, desc: undefined },
};

export enum PunishmentType {
  BAN = "ban",
  MUTE = "mute",
}

export interface PunishmentData {
  type: PunishmentType;
  userId: number;
}

export interface MuteData extends PunishmentData {
  expireAt: number;
}

export interface BanData extends PunishmentData {}

export interface ChannelMessageData {
  authorId: number;
  text: string;
  userName: string;
  profilePicture: string;
}

export interface ChannelData {
  type: ChannelType;
  name: string;
  displayname: string;
  password: string | null;
  usersId: number[];
  ownerId: number | null;
  adminsId: number[] | null;
  punishments: PunishmentData[];
  messages: ChannelMessageData[];
}

export class Channel {
  channelData: ChannelData;

  constructor(channelData: ChannelData) {
    this.channelData = channelData;
  }
}

export enum ChannelUserRole {
  OWNER,
  ADMIN,
  MEMBER,
}

export type ChannelUser = UserData & {
  role: ChannelUserRole;
  banned: boolean;
  muted: boolean;
};

export function createChannelUser(userData: UserData, channelData: ChannelData): ChannelUser {
  const userId = userData.id !== null ? parseInt(userData.id) : -1;
  let role = ChannelUserRole.MEMBER;
  let banned = false;
  let muted = false;

  if (channelData.ownerId === userId) role = ChannelUserRole.OWNER;
  else if (channelData.adminsId?.find((adminId) => adminId === userId) !== undefined)
    role = ChannelUserRole.ADMIN;

  if (channelData.punishments !== undefined) {
    channelData.punishments.forEach((punishment) => {
      if (punishment.userId === userId) {
        banned = punishment.type === PunishmentType.BAN;
        muted = punishment.type === PunishmentType.MUTE;
      }
    });
  }

  return {
    ...userData,
    role: role,
    banned: banned,
    muted: muted,
  } as ChannelUser;
}

export function transformSliceToChannelData(data: any): ChannelData {
  if (data === null) return {} as ChannelData;

  const punishments: PunishmentData[] = data.punishments.map((punishment: any) => {
    if (punishment.type === PunishmentType.BAN) {
      return {
        type: PunishmentType.BAN,
        userId: punishment.userId,
      } as BanData;
    } else if (punishment.type === PunishmentType.MUTE) {
      return {
        type: PunishmentType.MUTE,
        userId: punishment.userId,
        expireAt: punishment.expireAt,
      } as MuteData;
    }
    return {} as PunishmentData;
  });


  const messages: ChannelMessageData[] = data.messages.map((message: any) => {
    return {
      authorId: message.authorId,
      text: message.text,
      userName: message.userName,
      profilePicture: message.profilePicture,
    };
  });

  return {
    type: data.type,
    name: data.name,
    displayname: data.displayname,
    password: data.password,
    usersId: data.usersId,
    ownerId: data.ownerId,
    adminsId: data.adminsId,
    punishments: punishments,
    messages: messages,
  };
}
