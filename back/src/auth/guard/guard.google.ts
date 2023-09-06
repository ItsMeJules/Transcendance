import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext) {
    // call canActivate from AuthGuard 'google' so it will call validate from GoogleStrategy
    const activate = (await super.canActivate(context)) as boolean; 
    return activate;
  }
}
