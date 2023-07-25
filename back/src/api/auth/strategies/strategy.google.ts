import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Profile , Strategy } from 'passport-google-oauth20';
import { UserService } from '../../../database/service/user.service';
import { AuthService } from '../auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
	constructor(
		readonly userService: UserService,
		readonly authService: AuthService) {
		console.log('debugstrategygoogle');
		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:3000/api/auth/google/redirect',
			scope: ['profile', 'email'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile) : Promise<User> {
		console.log('accessToken : ', accessToken);
		console.log('refreshToken : ', refreshToken);
		console.log('profile : ', profile);
		const user = await this.userService.findOrCreateUserOAuth({
			username: profile._json.name,
			name: profile._json.given_name,
			surname: profile._json.family_name,
			email: profile._json.email,
			profilePicture: profile._json.picture,
		});
		return user ;
	}	
	
}
