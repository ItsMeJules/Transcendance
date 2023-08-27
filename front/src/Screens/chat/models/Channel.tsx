import { ChatMessageData } from "./ChatMessageData";

export enum ChannelType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  PROTECTED = "PROTECTED",
}

export const ChannelTypeDescription = {
  PUBLIC: { name: "Public", desc: "Canal accessible par tout le monde." },
  PRIVATE: { name: "Privé", desc: "Canal accessible sous invitation." },
  PROTECTED: { name: "Protégé", desc: "Canal protégé par un mot de passe." },
};

export interface PunishmentData {
  userId: number;
  channelFrom: string;
}

export interface MuteData extends PunishmentData {
  expireAt: number;
}

export interface BanData extends PunishmentData {}

export interface ChannelMessageData {
  authorId: number;
  text: "YE";
}

export interface ChannelData {
  type: ChannelType;
  name: string;
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

// TODO Finish this type
export function transformToChannelData(data: any): ChannelData {
  const punishments: PunishmentData[] = [];

  // data.mutes.forEach(mute => {
  //   punishments.push({userId:})
  // })

  return {
    type: data.type,
    name: data.name,
    password: data.password,
    usersId: data.users,
    ownerId: data.ownerId,
    adminsId: data.admins,
    punishments: punishments,
    messages: data.messages,
  };
}
