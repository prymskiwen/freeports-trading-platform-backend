import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsUniqueInDb } from 'src/validation/is-unique-in-db.validation';

export class CreateUserRequestDto {
  /**
   * @example 'John Doe'
   */
  @IsNotEmpty()
  nickname: string;

  /**
   * @example 'p@ssword123'
   */
  password?: string;

  /**
   * @example 'john@doe.com'
   */
  @IsNotEmpty()
  @IsEmail()
  @IsUniqueInDb({ schema: 'users', path: 'personal.email' })
  email: string;

  phone: string;

  avatar?: string;

  jobTitle?: string;
}
