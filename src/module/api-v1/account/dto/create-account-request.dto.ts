import {
  IsEnum,
  IsIBAN,
  IsNotEmpty,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { AccountType } from 'src/schema/account/account.schema';

export class CreateAccountRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  @IsEnum(AccountType)
  type: AccountType;

  @IsNotEmpty()
  @IsNumber()
  balance?: number;

  @ValidateIf((o) => o.type === AccountType.fiat)
  @IsNotEmpty()
  @IsIBAN()
  iban?: string;
}
