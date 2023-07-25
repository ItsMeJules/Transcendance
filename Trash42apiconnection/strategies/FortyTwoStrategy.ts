
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Profile, Strategy } from 'passport-42';
import { User } from '@prisma/client';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({ // call the parent class : PassportStrategy
			clientID: 'u-s4t2ud-edd22e90300fa3e73034ba89282ffb17d34215bf9fe1aa6a7281fb2648509b0',
			clientSecret: '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',
			callbackURL: 'http://localhost:3000/api/caca'
		});
	}

	// async validate(accessToken: string, refreshToken: string, profile: Profile, done: Function): Promise<User> {
		// const user = await this.userService.findOrCreateOne(profile.emails[0].value); // to implement with mixed signup options
		// console.log(user)
		// return user;
	// }
}