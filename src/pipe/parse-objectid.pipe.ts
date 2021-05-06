import { PipeTransform, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { InvalidMongoIdException } from 'src/exeption/invalid-mongoid.exception';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    const validObjectId = Types.ObjectId.isValid(value);

    if (!validObjectId) {
      throw new InvalidMongoIdException();
    }

    return Types.ObjectId.createFromHexString(value);
  }
}
