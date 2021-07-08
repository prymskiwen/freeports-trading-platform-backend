import { IsNotEmpty } from 'class-validator';

export class CreateAccountCryptoRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  currency: string;
}
