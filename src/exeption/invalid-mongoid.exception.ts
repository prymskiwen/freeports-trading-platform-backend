import { UnprocessableEntityException } from '@nestjs/common';
import { ErrorType } from './enum/error-type.enum';

export class InvalidMongoIdException extends UnprocessableEntityException {
  constructor() {
    super({
      errorType: ErrorType.IdInvalid,
      message: 'Invalid id',
    });
  }
}
