import { UnauthorizedException } from '@nestjs/common';
import { ErrorType } from './enum/error-type.enum';

export class ExpiredTokenException extends UnauthorizedException {
  constructor() {
    super({
      errorType: ErrorType.TokenExpired,
      message: 'Token has expired',
    });
  }
}
