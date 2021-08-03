import { IsNotEmpty, IsNumberString } from 'class-validator';
import { RequestTradeOrderType } from 'src/schema/request/embedded/request-trade-order.embedded';

export class CreateRequestTradeOrderRequestDto {
  @IsNotEmpty()
  @IsNumberString()
  quantity: string;

  @IsNotEmpty()
  @IsNumberString()
  price: string;

  validUntil?: string;

  orderType?: RequestTradeOrderType;

  @IsNotEmpty()
  rfqId: string;
}
