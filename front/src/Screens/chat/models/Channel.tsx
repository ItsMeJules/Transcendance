import User from "../../../Services/User";

export enum ChannelType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  PROTECTED = "PROTECTED"
}

export const ChannelTypeDescription = {
  PUBLIC: {name: "Public", desc: "Crée un canal accessible par tout le monde."},
  PRIVATE: {name: "Privé", desc: "Crée un canal où seules les personnes invitées peuvent rejoindre."},
  PROTECTED: {name: "Protégé", desc: "Crée un canal protégé par un mot de passe."}
}

export interface PunishmentData {
  user: User;
  channelFrom: string;
}

export interface MuteData extends PunishmentData {
  expireAt: number;
}

export interface BanData extends PunishmentData {}

export interface ChannelData {
  type: ChannelType;
  name: string;
  password: string | null;
  users: User[] | null;
  owner: User | null;
  admins: User[] | null;
  punishments: PunishmentData[]
}

export class Channel {
  channelData: ChannelData;

  constructor(channelData: ChannelData) {
    this.channelData = channelData;
  }
}