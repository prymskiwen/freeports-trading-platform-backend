import { BadRequestException } from '@nestjs/common';
import { ErrorType } from './enum/error-type.enum';

export class MissedParameterException extends BadRequestException {
  constructor(params?: string[]) {
    let message = 'Missed parameter';

    if (params.length) {
      message += params.length > 1 ? 's: ' : ': ';
      message += params.join(', ');
    }

    super({
      errorType: ErrorType.ParameterMissed,
      message: message,
    });
  }
}
