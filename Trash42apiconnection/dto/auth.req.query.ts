import { IsHexadecimal, IsNotEmpty , IsInt , IsBoolean } from "class-validator";

export class AuthReqQuery {
	@IsHexadecimal()
	@IsNotEmpty()
	code: string
}

export class PayloadDto {
    @IsInt()
    id: number;
    // @IsBoolean()
    // is2FAEnabled: boolean;
    // @IsBoolean()
    // is2FAAuthenticated: boolean;
}