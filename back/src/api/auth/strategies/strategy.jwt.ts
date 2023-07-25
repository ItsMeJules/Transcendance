import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadDto } from "../dto/payload.dto.js";
import { UserService } from "../../../database/service/user.service";
import { PrismaService } from "../../../database/service/prisma.service.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prismaService: PrismaService) {
        super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req) => {
				  return req.cookies?.access_token;
				},
			  ]),
            secretOrKey: process.env.jwtSecret,
        });
    }

    // private static extractJWTFromCookie(@Req() req: Request): string | null {
	// 	console.log('debug1');
    //     if (req.cookies && req.cookies.access_token) {
    //         return req.cookies.access_token;
    //     }
    //     return null;
    // }

    async validate(payload: {id: number}) {
		console.log('payload: ', payload);
		console.log('payload.sub: ', payload.id);
        const user = await this.prismaService.user.findUnique({where: {id: payload.id}});
		console.log('user: ', user);
        return user;
    }

}