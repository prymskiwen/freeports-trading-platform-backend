import {
  IsDateString,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { RequestTradeOrderType } from 'src/schema/request/embedded/request-trade-order.embedded';

export class CreateRequestTradeOrderRequestDto {
  @ValidateIf((o) => !o.rfqId)
  @IsNumberString()
  quantity: string;

  @ValidateIf((o) => !o.rfqId)
  @IsNumberString()
  price: string;

  @IsOptional()
  @IsDateString()
  validUntil?: Date;

  orderType?: RequestTradeOrderType;

  @IsNotEmpty()
  rfqId: string;
}
