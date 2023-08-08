import { HttpException } from '@nestjs/common';

export class NoTwoFaException extends HttpException {
  constructor() {
    super('2FA verification required', 450);
  }
}

export class TwoFaEnabledException extends HttpException {
  constructor() {
    super('2FA already checked', 451);
  }
}
