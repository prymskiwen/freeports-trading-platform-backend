import { RequestTradeRfqType } from 'src/schema/request/embedded/request-trade-rfq.embedded';

export class GetRequestTradeRfqResponseDto {
  id: string;
  brokerId: string;
  createdAt: Date;
  validUntil: Date;
  quantity: string;
  side: RequestTradeRfqType;
  price: string;
}
