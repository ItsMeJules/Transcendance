// import { URL, URLSearchParams } from 'url';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class ApiService {

// 	displayBigInt(bigInt : string): string {
// 		return bigInt;
// 	}

// 	createTokenRequest(codeAS : string, stateAS : string) {
// 		// 	grant_type		string	Required. The grant type. In this case, it's authorization_code.
// 		// 	client_id		string	Required. The client ID you received from 42 when you registered.
// 		// 	client_secret	string	Required. The client secret you received from 42 when you registered.
// 		// 	code			string	Required. The code you received as a response to Step 1.
// 		// 	redirect_uri	string	The URL in your app where users will be sent after authorization.
// 		// 	state			string	The unguessable random string you optionally provided in Step 1.
// 		const params = new URLSearchParams({
// 			grant_type: 'authorization_code',
// 			client_id: 'edd22e90300fa3e73034ba89282ffb17d34215bf9fe1aa6a7281fb2648509b0e', //need to change this shit
// 			client_secret: '3d9759cbe976abfc4c701854e74993917a39ce07c31cda492a8e274bdd615b32', //need to change this shit
// 			code: codeAS,
// 			redirect_uri: 'http://localhost:3000/api/caca',
// 			state: stateAS
// 		});
// 		const url = new URL('https://api.intra.42.fr/oauth/authorize');
// 		url.search = params.toString();
// 		return url.toString();
// 	}
// }


// // curl -F grant_type=authorization_code \
// // -F client_id=u-s4t2ud-edd22e90300fa3e73034ba89282ffb17d34215bf9fe1aa6a7281fb2648509b0e \
// // -F client_secret=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 \
// // -F code=18f4dee4a743a838caa1277aa2c162b78f787d8f3057b9c3c175a8293742bacf \
// // -F redirect_uri=http://localhost:3000/api/caca \
// // -X POST https://api.intra.42.fr/oauth/token

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor() {
    super({
      clientID: 'u-s4t2ud-edd22e90300fa3e73034ba89282ffb17d34215bf9fe1aa6a7281fb2648509b0e',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/api/callback'
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    // Here, you can handle the user profile returned by 42 API.
    // For instance, you could save it to your database, and return the user ID:

    const user = {
      accessToken,
      refreshToken,
      profile,
    };

    done(null, user);
  }
}

// import { URL, URLSearchParams } from 'url';
// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class ApiService {

// 	displayBigInt(bigInt : string): string {
// 		return bigInt;
// 	}

// 	createTokenRequest(codeAS : string, stateAS : string) {
// 		// 	grant_type		string	Required. The grant type. In this case, it's authorization_code.
// 		// 	client_id		string	Required. The client ID you received from 42 when you registered.
// 		// 	client_secret	string	Required. The client secret you received from 42 when you registered.
// 		// 	code			string	Required. The code you received as a response to Step 1.
// 		// 	redirect_uri	string	The URL in your app where users will be sent after authorization.
// 		// 	state			string	The unguessable random string you optionally provided in Step 1.
// 		const params = new URLSearchParams({
// 			grant_type: 'authorization_code',
// 			client_id: 'edd22e90300fa3e73034ba89282ffb17d34215bf9fe1aa6a7281fb2648509b0e', //need to change this shit
// 			client_secret: '3d9759cbe976abfc4c701854e74993917a39ce07c31cda492a8e274bdd615b32', //need to change this shit
// 			code: codeAS,
// 			redirect_uri: 'http://localhost:3000/api/caca',
// 			state: stateAS
// 		});
// 		const url = new URL('https://api.intra.42.fr/oauth/authorize');
// 		url.search = params.toString();
// 		return url.toString();
// 	}
// }


// // curl -F grant_type=authorization_code \
// // -F client_id=u-s4t2ud-edd22e90300fa3e73034ba89282ffb17d34215bf9fe1aa6a7281fb2648509b0u-s4t2ud-edd22e90300fa3e73034ba89282ffb17d34215bf9fe1aa6a7281fb2648509b0e \e \
// // -F client_secret=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 \
// // -F code=18f4dee4a743a838caa1277aa2c162b78f787d8f3057b9c3c175a8293742bacf \
// // -F redirect_uri=http://localhost:3000/api/caca \
// // -X POST https://api.intra.42.fr/oauth/token
