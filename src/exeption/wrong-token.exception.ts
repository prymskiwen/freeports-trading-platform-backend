import { UnauthorizedException } from '@nestjs/common';
import { ErrorType } from './enum/error-type.enum';

export class WrongTokenException extends UnauthorizedException {
  constructor() {
    super({
      errorType: ErrorType.TokenWrong,
      message: 'Use refresh token to retrieve a new access token only',
    });
  }
}
