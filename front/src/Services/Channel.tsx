import User from "./User";

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

export interface ChannelData {
  type: ChannelType;
  users: User[] | null;
  owner: User;
  admin: User;
  password: string | null;
}