import { InvalidFormException } from './invalid-form.exception';

export class UniqueFieldException extends InvalidFormException {
  constructor(path: string, value: string) {
    const message = [
      {
        path,
        constraints: {
          IsUnique: `${path} must be unique but ${value} already exists`,
        },
      },
    ];

    super(message);
  }
}
