import { ExecutionContext , Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
	async canActivate(context: ExecutionContext) { //  read ExecutionContext docs
		console.log('avant activate');
		const activate = (await super.canActivate(context)) as boolean; // call canActivate from AuthGuard 'google' so it will call validate from GoogleStrategy
		console.log('avant request');
		// const request = context.switchToHttp().getRequest(); // get the request from ExecutionContext
		// console.log('apres request');
		// const user = request.user;
		// console.log(request.user);
		// if there's no user, throw an UnauthorizedException
		// if (!user) {
		//   throw new UnauthorizedException();
		// }
		// if there's user, return it
		return activate;
		// console.log('apres login');
		// return activate; 
	}
}