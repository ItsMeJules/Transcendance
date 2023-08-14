import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class TestDto {
  @IsString()
  email: string;

  @IsString()
  password?: string;
}
