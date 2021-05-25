import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsUniqueInDb } from 'src/validation/is-unique-in-db.validation';

export class CreateUserRequestDto {
  @IsNotEmpty()
  nickname: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUniqueInDb({ schema: 'users', path: 'personal.email' })
  email: string;
}
