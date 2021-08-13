import { ApiProperty } from '@nestjs/swagger';
import { Account } from 'src/schema/account/account.schema';
import { RequestTradeOrderDocument } from 'src/schema/request/embedded/request-trade-order.embedded';
import { RequestTradeType } from 'src/schema/request/request-trade.schema';
import { GetRequestResponseDto } from '../get-request-response.dto';

export class GetRequestTradeResponseDto extends GetRequestResponseDto {
  @ApiProperty({ type: Account, description: 'Trade account from Id' })
  accountFrom: Account;

  @ApiProperty({ type: Account, description: 'Trade account to Id' })
  accountTo: Account;

  currencyFrom: string;
  currencyTo: string;
  type: RequestTradeType;
  limitPrice?: string;
  limitTime?: Date;

  orders: RequestTradeOrderDocument[];
}
