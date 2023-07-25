import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { UserService } from '../../../database/service/user.service'
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42')
{
	constructor(readonly userService: UserService){ //readonly / private ?
		super({
			clientID: process.env.FORTYTWO_CLIENT_ID,
			clientSecret: process.env.FORTYTWO_CLIENT_SECRET,
			callbackURL: process.env.FORTYTWO_CALLBACK_URL,
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> { //promise? <any?> void?
		console.log('accessToken : ', accessToken); // DTO concept?
		console.log('refreshToken : ', refreshToken);
		console.log('profile : ', profile);
		console.log('before findOrCreateUserOAuth');
		const user = await this.userService.findOrCreateUserOAuth({
			username: profile._json.login,
			name: profile._json.first_name,
			surname: profile._json.last_name,
			email: profile._json.email,
			profilePicture: profile._json.image.link,
		});
		console.log('after findOrCreateUserOAuth');
		return user ;
	}
}