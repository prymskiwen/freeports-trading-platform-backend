import {
  IsEnum,
  IsIBAN,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { AccountDetailsType } from 'src/schema/account/embedded/account-details.embedded';

export class CreateAccountRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  @IsEnum(AccountDetailsType)
  type: AccountDetailsType;

  @IsNotEmpty()
  @IsNumber()
  balance?: number;

  @ValidateIf((o) => o.type === AccountDetailsType.fiat)
  @IsNotEmpty()
  @IsIBAN()
  iban?: string;

  @ValidateIf((o) => o.type === AccountDetailsType.crypto)
  @IsNotEmpty()
  publicAddress?: string;

  @ValidateIf((o) => o.type === AccountDetailsType.crypto)
  @IsNotEmpty()
  vaultWalletId?: string;
}
