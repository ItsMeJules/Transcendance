import { IsHexadecimal, IsNotEmpty } from "class-validator";

export class AuthReqQuery {
	@IsHexadecimal()
	@IsNotEmpty()
	code: string
}