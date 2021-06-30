import { IsIBAN, IsNotEmpty } from 'class-validator';

export class CreateAccountFiatRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  @IsIBAN()
  iban: string;
}
