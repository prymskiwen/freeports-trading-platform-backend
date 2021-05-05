import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { ErrorType } from 'src/exeption/enum/error-type.enum';

export class ValidationPipeCustomException extends ValidationPipe {
  public async transform(value: any, metadata: ArgumentMetadata) {
    try {
      return await super.transform(value, metadata);
    } catch (e) {
      if (e instanceof BadRequestException) {
        throw new BadRequestException({
          errorType: ErrorType.FormInvalid,
          message: e.getResponse()['message'],
        });
      }
    }
  }
}
