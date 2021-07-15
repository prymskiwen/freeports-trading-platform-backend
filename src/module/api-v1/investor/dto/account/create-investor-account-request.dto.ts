import { IsNotEmpty } from 'class-validator';

export class CreateInvestorAccountRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  currency: string;
}
