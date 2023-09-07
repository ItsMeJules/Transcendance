import {
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

function handleJwtError(err: any) {
  if (err instanceof jwt.TokenExpiredError)
    throw new UnauthorizedException(
      'Your session has expired. Please log in again.',
    );
  else if (err instanceof jwt.JsonWebTokenError)
    throw new UnauthorizedException('Invalid token. Please log in again.');
  else if (err instanceof jwt.NotBeforeError)
    throw new UnauthorizedException('Token is not active yet.');
}

export default handleJwtError;
