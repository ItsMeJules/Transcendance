import { RoomType } from '@prisma/client';

export enum AcknowledgementType {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
}

export type RoomInfo = {
  name: string;
  type: RoomType;
  userCount: number;
};

export type AcknowledgementPayload = {
  type: AcknowledgementType;
  message: string;
};
