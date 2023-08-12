import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class GameDto {
    @IsNotEmpty()
    @IsString()
    gameMode: string;
}