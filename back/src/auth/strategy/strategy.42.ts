import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UserService } from 'src/user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42')
{
	constructor(readonly userService: UserService){ //readonly / private ?
		super({
			clientID: process.env.FORTYTWO_CLIENT_ID,
			clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
			callbackURL: 'http://localhost:8000/auth/42/redirect', // change this
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> { //promise? <any?> void?
		const user = await this.userService.findOrCreateUserOAuth({
			username: profile._json.login,
			firstName: profile._json.first_name,
			lastName: profile._json.last_name,
			email: profile._json.email,
			profilePicture: profile._json.image.link,
			hash: '',
		});
		return user ;
	}
}