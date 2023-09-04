import { RoomType } from '@prisma/client';
import { RoomSocketActionType } from 'src/utils';

export enum AcknowledgementType {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INVITATION = 'invitation',
  PENDING_INVITE = 'pending_invite',
}

export type RoomInfo = {
  name: string;
  type: RoomType;
  userCount: number;
};

export type AcknowledgementPayload = {
  actionType?: RoomSocketActionType;
  userId?: number;
  type: AcknowledgementType;
  message: string;
};
