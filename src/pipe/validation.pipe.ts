import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { InvalidFormException } from 'src/exeption/invalid-form.exception';

export class ValidationPipeCustomException extends ValidationPipe {
  public createExceptionFactory() {
    return (errors?: ValidationError[]) => {
      const messages = errors.map((error) => {
        return {
          path: error.property,
          constraints: error.constraints,
        };
      });

      if (messages.length) {
        throw new InvalidFormException(messages);
      }
    };
  }
}
