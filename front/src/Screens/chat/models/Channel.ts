export enum ChannelType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  PROTECTED = "PROTECTED"
}

export const ChannelTypeDescription = {
  PUBLIC: { name: "Public", desc: "Canal accessible par tout le monde." },
  PRIVATE: { name: "Privé", desc: "Canal accessible sous invitation." },
  PROTECTED: { name: "Protégé", desc: "Canal protégé par un mot de passe." }
}

export enum PunishmentType {
  BAN,
  MUTE
}

export interface PunishmentData {
  type: PunishmentType;
  userId: number;
}

export interface MuteData extends PunishmentData {
  expireAt: number;
}

export interface BanData extends PunishmentData { }

export interface ChannelMessageData {
  authorId: number,
  text: string,
}

export interface ChannelData {
  type: ChannelType;
  name: string;
  password: string | null;
  usersId: number[];
  ownerId: number | null;
  adminsId: number[] | null;
  punishments: PunishmentData[]
  messages: ChannelMessageData[];
}

export class Channel {
  channelData: ChannelData;

  constructor(channelData: ChannelData) {
    this.channelData = channelData;
  }
}

// TODO Finish this type
export function transformToChannelData(data: any): ChannelData {
  if (data === null)
    return {} as ChannelData
    
  const punishments: PunishmentData[] = data.punishments.map((punishment: any) => {
    if (punishment.type === PunishmentType.BAN) {
      return {
        type: PunishmentType.BAN,
        userId: punishment.userId
      } as BanData;
    } else if (punishment.type === PunishmentType.MUTE) {
      return {
        type: PunishmentType.MUTE,
        userId: punishment.userId,
        expireAt: punishment.expireAt
      } as MuteData;
    }
    return {} as PunishmentData;
  });

  const messages: ChannelMessageData[] = data.messages.map((message: any) => {
    return {
      authorId: message.authorId,
      text: message.text
    };
  });

  return {
    type: data.type,
    name: data.name,
    password: data.password,
    usersId: data.users,
    ownerId: data.ownerId,
    adminsId: data.admins,
    punishments: punishments,
    messages: messages,
  }
}