import { HttpException } from '@nestjs/common';

export class TwoFactorException extends HttpException {
  constructor() {
    super('2FA verification required', 499);
  }
}
