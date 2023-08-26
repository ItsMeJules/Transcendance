import { RoomType } from '@prisma/client';

export type RoomInfo = {
  name: string;
  type: RoomType;
  userCount: number;
};
