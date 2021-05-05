import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { IsUniqueInDb } from 'src/validation/is-unique-in-db.validation';
import { UserRoles } from 'src/schema/user/user.schema';

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

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(UserRoles, { each: true })
  roles: UserRoles[];
}
