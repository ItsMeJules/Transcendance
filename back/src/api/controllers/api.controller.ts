import { Controller, Get , Query , Redirect , Res } from '@nestjs/common';

import { ApiService } from '../services/api.service';
import { AuthReqQuery } from '../dto/auth.req.query';


@Controller('api')
export class ApiController {

	constructor(private readonly apiService: ApiService) {}

	@Get('42')
	request42Api() {
		fetch('https://api.intra.42.fr/oauth/authorize')
		.then(response => console.log(response))
	}

	@Get('callback')
	// @Redirect('/success') // Redirect to a success page after handling the callback
	async handleCallback(@Query('code') authorizationCode: string, @Res() res: Response): Promise<void> {
		console.log(authorizationCode);
		console.log(res);
		if (!authorizationCode) {
			// Handle the case when the authorization code is missing or invalid
			console.log("error");
			// throw new BadRequestException('Invalid authorization code');
		}

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
	}
}