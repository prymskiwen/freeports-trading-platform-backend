import { RequestTradeOrderStatus } from 'src/schema/request/embedded/request-trade-order.embedded';
import { RequestTradeRfqSide } from 'src/schema/request/embedded/request-trade-rfq.embedded';

export class GetRequestTradeOrderResponseDto {
  id: string;
  brokerId: string;
  createdAt: Date;
  validUntil: Date;
  quantity: string;
  side: RequestTradeRfqSide;
  price: string;
  executedPrice: string;
  status: RequestTradeOrderStatus;
}
