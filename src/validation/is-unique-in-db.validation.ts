import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Connection } from 'mongoose';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsUniqueInDbConstraint implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private connection: Connection) {}

  defaultMessage(args: ValidationArguments) {
    return '$property must be unique but $value already exists';
  }

  async validate(columnNameValue: any, args: ValidationArguments) {
    const params = args.constraints[0];
    const docCount = await this.connection.db
      .collection(params.schema)
      .countDocuments({ [params.path]: columnNameValue });

    return !docCount;
  }
}

export function IsUniqueInDb(
  params: { ['schema']: string; ['path']: string },
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [params],
      validator: IsUniqueInDbConstraint,
    });
  };
}
