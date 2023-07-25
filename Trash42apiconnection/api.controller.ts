import { HttpService } from '@nestjs/axios';
import { Controller, Get, Query, Res, Inject, HttpCode , UseGuards , Req } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { lastValueFrom } from 'rxjs';
import { FortyTwoAuthGuard } from './guards/FortyTwoGuard.service'
import { FortyTwoStrategy } from './strategies/FortyTwoStrategy';
import { create } from 'domain';

interface RequestUser extends Request {
	user: {
		accessToken: string;
		refreshToken: string;
		profile: any;
	}
}


@Controller('api')
export class ApiController {
	
	constructor(
		// private readonly fortyTwoStrategy: FortyTwoStrategy,
		private readonly authService: AuthService,
		// private readonly httpService: HttpService  // inject HttpService here
		) {}
		
	@Get('callback')
	@UseGuards(FortyTwoAuthGuard)
	async handle42Redirect(@Req() req: any, @Res({ passthrough: true }) res: Response) {
		const access_token = await this.authService.login(req.user);
		res.cookie('access_token', access_token, {
			maxAge: 60 * 60 * 24 * 7,
		});
		res.redirect('http://' + 'localhost' + ':4000');
	}
	
	@Get('42')
	request42Api() {
		fetch('https://api.intra.42.fr/oauth/authorize')
		.then(response => console.log(response))
	}

	@Get('caca')
	random()
	{
		console.log('ds la merde fdp');
	}

	// @Get('callback')
	// // @UseGuards(AuthGuard('42')) // guard this route with 42 strategy
	// // login42Callback(@Req() req: RequestUser) {
	// //   // handles the 42 OAuth2 callback
	// //   const user = req.user;
	// //   return user;
	// // }
	// async handleCallback(@Query('code') codeAS: string, @Query('state') stateAS : string, @Res() res: Response): Promise<void> {
	// 	try {
	// 		if (!codeAS) {
	// 			throw ('Invalid authorization code');
	// 		}
	// 		console.log(codeAS);
	// 		console.log(stateAS);
	// 	// 	console.log(res);
	// 		const axiosResponse = await this.httpService.post(this.apiService.createTokenRequest(codeAS, stateAS)).toPromise();
	// 		if (axiosResponse.status !== 200) {
	// 		  throw new Error(`Unexpected response code: ${axiosResponse.status}`);
	// 		}
		
	// 		const { access_token } = axiosResponse.data;
	// 		console.log(access_token);
	// 		console.log(this.apiService.createTokenRequest(codeAS, stateAS));
	// 		console.log('caca');
	// 		// console.log(create?e
	// 	  } catch (err) {
	// 		console.log(err);
	// 	  }
	// }

	// Proceed with exchanging the authorization code for an access token
	// Implement the code to make the POST request to the AS's token endpoint here
	// ...

	// Handle the response from the token endpoint
	// Extract the access token and other relevant information
	// Store the access token securely, e.g., in a session or database
	// ...

	// @Get('callback')
	// getAuthCode(@Query() authReqQuery: AuthReqQuery): string {
	// 	return this.apiService.displayBigInt(authReqQuery.code);
	// }	
	// res.redirected('/success');
	// }
}