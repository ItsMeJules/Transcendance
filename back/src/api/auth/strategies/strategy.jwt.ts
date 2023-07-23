import { Injectable, Req, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PayloadDto } from "../dto/payload.dto.js";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWTFromCookie,]),
            ignoreExpiration: false,
            secretOrKey: process.env.jwtSecret,
        });
    }

    private static extractJWTFromCookie(@Req() req: Request): string | null {
		console.log('debug1');
        if (req.cookies && req.cookies.access_token) {
            return req.cookies.access_token;
        }
        return null;
    }

    async validate(payload: PayloadDto): Promise<any> {
        // if (payload.is2FAEnabled && !payload.is2FAAuthenticated) {
        //     throw new UnauthorizedException('require second authentication step');
        // }
		console.log('payload: ');
        return {
            id: payload.id
        }
    }

}