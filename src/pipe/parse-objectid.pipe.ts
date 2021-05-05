import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ErrorType } from 'src/exeption/enum/error-type.enum';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    const validObjectId = Types.ObjectId.isValid(value);

    if (!validObjectId) {
      throw new BadRequestException({
        errorType: ErrorType.IdInvalid,
        message: 'Invalid Id',
      });
    }

    return Types.ObjectId.createFromHexString(value);
  }
}
