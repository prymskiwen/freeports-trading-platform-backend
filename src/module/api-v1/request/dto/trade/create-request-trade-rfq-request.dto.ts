import { IsNotEmpty } from 'class-validator';

export class CreateRequestTradeRfqRequestDto {
  @IsNotEmpty()
  quantity: string;
}
