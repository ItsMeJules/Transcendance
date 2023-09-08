import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';
import { TwoFactorException } from './two-factor.exception';

@Catch(TwoFactorException)
export class TwoFactorAuthenticationFilter implements ExceptionFilter {
  catch(exception: TwoFactorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.redirect(`http://${process.env.LOCAL_IP}:8000/`);
  }
}
