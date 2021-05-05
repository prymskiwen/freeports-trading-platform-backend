import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIBAN,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { AccountDetailsType } from 'src/schema/account/embedded/account-details.embedded';

class CreateAccountDetailsDto {
  @IsNotEmpty()
  internalName: string;

  @IsNotEmpty()
  @IsEnum(AccountDetailsType)
  type: AccountDetailsType;

  @IsNotEmpty()
  currency: string;
}

class CreateAccountFiatDetailsDto {
  @IsNotEmpty()
  @IsIBAN()
  iban: string;
}

class CreateAccountCryptoDetailsDto {
  @IsNotEmpty()
  publicAddress: string;

  @IsNotEmpty()
  vaultWalletId: string;
}

export class CreateAccountDto {
  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'User Id',
  })
  @IsMongoId()
  owner: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateAccountDetailsDto)
  details?: CreateAccountDetailsDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateAccountFiatDetailsDto)
  fiatDetails?: CreateAccountFiatDetailsDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateAccountCryptoDetailsDto)
  cryptotDetails?: CreateAccountCryptoDetailsDto;
}
