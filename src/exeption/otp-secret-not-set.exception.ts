import { BadRequestException } from '@nestjs/common';

export class OTPSecretNotSet extends BadRequestException {
  constructor() {
    super({
      errorType: 'VALUE_DOESNT_EXIST',
      message: 'OTP secret is Not set, please use auth/2fa/generate first ',
    });
  }
}
