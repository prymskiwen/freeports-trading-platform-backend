import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
  /**
   * @example 'john@doe.com'
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * @example 'p@ssword123'
   */
  @IsNotEmpty()
  password: string;
}
