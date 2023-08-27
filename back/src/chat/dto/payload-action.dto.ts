import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PayloadActionDto {
  @IsNumber()
  targetId?: number;

  @IsString()
  roomName?: string;

  @IsString()
  targetRoom?: string;

  @IsString()
  name?: string;

  @IsString()
  password?: string;

  @IsString()
  text?: string;

  @IsNotEmpty()
  action: string;

  @IsString()
  type?: string;
}
