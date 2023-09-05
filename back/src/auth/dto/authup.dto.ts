import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthDtoUp {
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
