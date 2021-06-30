import { IsNotEmpty } from 'class-validator';

export class CreateAccountCryptoRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  publicAddress: string;

  @IsNotEmpty()
  vaultWalletId: string;
}
