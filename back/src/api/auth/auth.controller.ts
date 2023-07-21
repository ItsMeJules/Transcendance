import { Controller , Get, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/guard.google';

@Controller('api/auth')
export class AuthController {
	@Get('google/login')
	@UseGuards(GoogleAuthGuard)
	handleLogin() {
		console.log('google Authentification');
		return { msg: 'google Authentification'};
	}

	@Get('google/redirect')
	@UseGuards(GoogleAuthGuard) 
	handleRedirect() {
		
		return { msg: 'OK'};
	}

	@Get('')
	ok()
	{	return { msg: 'rien'};	}
}