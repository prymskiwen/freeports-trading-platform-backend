import { BadRequestException } from '@nestjs/common';
import { ErrorType } from './enum/error-type.enum';

export class OTPSecretAlreadySet extends BadRequestException {
  constructor() {
    super({
      errorType: ErrorType.ValueExists,
      message: 'OTP secret is already set',
    });
  }
}
