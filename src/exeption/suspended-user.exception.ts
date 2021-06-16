import { UnauthorizedException } from '@nestjs/common';
import { ErrorType } from './enum/error-type.enum';

export class SuspendedUserException extends UnauthorizedException {
  constructor() {
    super({
      errorType: ErrorType.UserSuspended,
      message: 'User suspended and not authorized to login',
    });
  }
}
