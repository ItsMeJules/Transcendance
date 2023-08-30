import { IsString } from 'class-validator';

export class connectToRoomDto {
  @IsString()
  targetRoom: string;
}
