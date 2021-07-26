import { IsNotEmpty, IsNumberString } from 'class-validator';

export class CreateRequestTradeRfqRequestDto {
  @IsNotEmpty()
  @IsNumberString()
  quantity: string;
}
