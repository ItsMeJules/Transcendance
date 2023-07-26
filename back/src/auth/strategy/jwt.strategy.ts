import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { PrismaClient } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt',) {
    constructor(configService: ConfigService, private prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
				(req) => {

				  return req.cookies?.access_token;
				},
			  ]),
            secretOrKey: process.env.jwtSecret,
        });
    }

    async validate_iac(payload: { sub: number, email: string }) {

        console.log("Validate:", payload);
        const user = await this.prismaService.user.findUnique({
            where: {
                id: payload.sub,
                email: payload.email,
            }
        })

        if (user)
            delete user.hash;

        return user;
    }

    async validate(payload: {id: number}) {
		console.log('payload: ', payload);
		console.log('payload.sub: ', payload.id);
        const user = await this.prismaService.user.findUnique({where: {id: payload.id}});
		console.log('user: ', user);
        return user;
    }
}