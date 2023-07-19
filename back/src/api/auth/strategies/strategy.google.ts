import { PassportStrategy } from '@nestjs/passport';
import { Profile , Strategy } from 'passport-google-oauth20';

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor() {
		super({
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: 'http://localhost:3000/api/auth/google/redirect',
			scope: ['profile', 'email'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile) {
		console.log('accessToken : ', accessToken);
		console.log('refreshToken : ', refreshToken);
		console.log('profile : ', profile);
	}
	
}
