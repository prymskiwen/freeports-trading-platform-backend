import { UnauthorizedException } from '@nestjs/common';
import { ErrorType } from './enum/error-type.enum';

export class Invalid2faCodeException extends UnauthorizedException {
  constructor() {
    super({ errorType: ErrorType.TokenInvalid, message: 'Invalid 2fa secret' });
  }
}
