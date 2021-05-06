import { BadRequestException } from '@nestjs/common';
import { ErrorType } from './enum/error-type.enum';

export class InvalidFormException extends BadRequestException {
  constructor(
    message?: { path: string; constraints: { [type: string]: string } }[],
  ) {
    super({
      errorType: ErrorType.FormInvalid,
      message: message ?? 'Invalid form',
    });
  }
}
