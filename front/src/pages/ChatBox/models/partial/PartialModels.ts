import { ChannelType } from "../Channel";

export type ChannelInfoInList = {
  name: string;
  type: ChannelType;
  userCount: number;
  ownerId: number,
  hasPassword: boolean,
  adminsId: [],
  bannedId: [],
};