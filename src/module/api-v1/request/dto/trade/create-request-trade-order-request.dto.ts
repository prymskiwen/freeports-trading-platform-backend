import { IsNotEmpty, IsNumberString } from 'class-validator';
import { OrderType } from 'src/module/api-v1/brokers/brokers/b2c2/b2c2.broker';

export class CreateRequestTradeOrderRequestDto {
  @IsNotEmpty()
  @IsNumberString()
  quantity: string;

  @IsNotEmpty()
  @IsNumberString()
  price: string;

  validUntil?: string;

  orderType?: OrderType;
}
