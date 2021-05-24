import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { IsUniqueInDb } from 'src/validation/is-unique-in-db.validation';

class CreateUserPersonalDto {
  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUniqueInDb({ schema: 'users', path: 'personal.email' })
  email: string;
}

export class CreateUserDto {
  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'User Id',
  })
  @IsMongoId()
  organization: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateUserPersonalDto) // <= Mandatory to validate subobject
  personal: CreateUserPersonalDto;
}
