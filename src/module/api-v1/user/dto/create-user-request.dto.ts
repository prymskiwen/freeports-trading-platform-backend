import { IsEmail, IsNotEmpty } from 'class-validator';
import { VaultRequestDto } from '../../vault/dto/vault-request.dto';

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
  email: string;

  phone: string;

  avatar?: string;

  jobTitle?: string;

  vaultUserId?: string;
  vaultRequest?: VaultRequestDto;
}
