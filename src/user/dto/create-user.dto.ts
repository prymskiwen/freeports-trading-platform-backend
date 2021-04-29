import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';

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
}
