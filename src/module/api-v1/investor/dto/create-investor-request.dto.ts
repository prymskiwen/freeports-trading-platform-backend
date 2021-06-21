import { IsNotEmpty } from 'class-validator';

export class CreateInvestorRequestDto {
  @IsNotEmpty()
  name: string;
}
