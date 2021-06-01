import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { InvalidFormException } from 'src/exeption/invalid-form.exception';

export class ValidationPipeCustomException extends ValidationPipe {
  private walk(errors: ValidationError[], path = '') {
    return errors.map((error) => {
      const pathNew = path + (path ? '.' : '') + error.property;

      if (error.constraints) {
        return {
          path: pathNew,
          constraints: error.constraints,
        };
      }

      return this.walk(error.children, pathNew);
    });
  }

  public createExceptionFactory() {
    return (errors?: ValidationError[]) => {
      const messages = this.walk(errors);

      if (messages.length) {
        throw new InvalidFormException(messages);
      }
    };
  }
}
