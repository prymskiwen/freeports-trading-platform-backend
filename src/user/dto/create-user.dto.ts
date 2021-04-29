import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { UserRoles } from '../schema/user.schema';

class CreateUserPersonalDto {
  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
export class CreateUserDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateUserPersonalDto) // <= Mandatory to validate subobject
  personal: CreateUserPersonalDto;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(UserRoles, { each: true })
  roles: UserRoles[];
}
