import { IsString, IsNotEmpty } from 'class-validator';

export class ModifyPasswordDto {
  @IsNotEmpty()
  @IsString()
  roomName: string;

  @IsString()
  password: string;
}
