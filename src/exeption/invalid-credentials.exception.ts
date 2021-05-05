import { UnauthorizedException } from '@nestjs/common';
import { ErrorType } from './enum/error-type.enum';

export class InvalidCredentialsException extends UnauthorizedException {
  constructor() {
    super({
      errorType: ErrorType.CredentialsInvalid,
      message: 'Invalid credentials',
    });
  }
}
