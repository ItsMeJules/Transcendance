import { IsNotEmpty, IsString } from "class-validator";

export class UserDTO {
	@IsString()
	@IsNotEmpty()
	name: string
}