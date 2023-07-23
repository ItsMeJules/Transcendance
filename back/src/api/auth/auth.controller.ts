import { Controller , Get, UseGuards , Res , Req} from '@nestjs/common';
import { Response } from 'express';
import { User as UserModel } from '@prisma/client'
import { GoogleAuthGuard } from './guards/guard.google';
import { UserService } from '../../database/service/user.service';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
	constructor(private readonly userService: UserService,
				private readonly authService: AuthService) {}
	@Get('google/login')
	@UseGuards(GoogleAuthGuard)
	handleLogin() {
		console.log('google Authentification');
		return { msg: 'google Authentification'};
	}

	@Get('google/redirect')
	@UseGuards(GoogleAuthGuard)
	async handleRedirect(@Req() req,@Res({ passthrough: true }) res: Response) {
		// console.log('req.user: ', req.user, 'req', req);
        const access_token = await this.authService.login(req.user/*, false*/);
        res.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: 'lax',
        });
		res.redirect('http://localhost:4000');
	}

	@Get('')
	ok()
	{	return { msg: 'rien'};	}
}