import { Controller , Get, UseGuards , Res , Req} from '@nestjs/common';
import { Response } from 'express';
import { User as UserModel } from '@prisma/client'
import { GoogleAuthGuard } from './guards/guard.google';
import { UserService } from '../../database/service/user.service';
import { AuthService } from './auth.service';
import { JwtGuard } from './guards/guard.jwt';

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
	async handleRedirect(@Req() req, @Res({ passthrough: true }) res: Response) {
	  // Le décorateur @Get indique que cette méthode gère les requêtes HTTP GET pour l'URL "google/redirect".
	  // Le décorateur @UseGuards(GoogleAuthGuard) indique que le "GoogleAuthGuard" sera utilisé pour authentifier cette route.
	
	  // Récupérer l'utilisateur authentifié depuis l'objet "req" (la requête HTTP).
	  // Cet utilisateur a été authentifié par le "GoogleAuthGuard" avant que cette méthode ne soit appelée.
	  // Il sera stocké dans la propriété "user" de l'objet "req".
	  // L'utilisateur authentifié est utilisé pour générer un access_token ci-dessous.
	  const access_token = await this.authService.login(req.user /*, false*/);
	  console.log(access_token);
	
	  // Définir un cookie nommé "access_token" sur la réponse "res".
	  // Ce cookie contiendra l'access_token généré ci-dessus.
	  // Les options "httpOnly", "maxAge" et "sameSite" spécifient des propriétés du cookie.
	  // Ici, le cookie est défini avec une durée de vie de 7 jours et les options "httpOnly" et "sameSite" pour des raisons de sécurité.
	  res.cookie('access_token', access_token, {
		httpOnly: true,
		maxAge: 60 * 60 * 24 * 10000,
		sameSite: 'lax',
	  });
	
	  // Rediriger l'utilisateur vers l'URL "http://localhost:3000/api/auth/test123".
	  // Cela signifie que lorsque l'utilisateur accède à cette route "google/redirect", il sera automatiquement redirigé vers "http://localhost:3000/api/auth/test123".
	//   res.redirect('http://localhost:3000/api/auth/test123');
	
	  // Notez que la méthode ne renvoie rien (void). Cela est courant pour les méthodes de gestion de routes dans NestJS.
	  // Si vous décommentez "return (access_token);", cela ne renverra que l'access_token sans effectuer la redirection.
	  // La redirection sera ignorée si vous renvoyez quelque chose de la méthode.
	  res.redirect('http://localhost:3000/api/auth/test123');
	//   return (access_token);
	}

	@Get('test123')
	@UseGuards(JwtGuard) 
	async test123 (@Res() res){
		res.json('good');
	}
}