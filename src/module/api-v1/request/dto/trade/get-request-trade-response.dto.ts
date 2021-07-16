import { ApiProperty } from '@nestjs/swagger';
import { Account } from 'src/schema/account/account.schema';
import { RequestTradeType } from 'src/schema/request/request-trade.schema';
import { RequestStatus } from 'src/schema/request/request.schema';

export class GetRequestTradeResponseDto {
  id: string;

  status: RequestStatus;
  createdAt: Date;

  @ApiProperty({ type: Account, description: 'Trade account from Id' })
  accountFrom: Account;

  @ApiProperty({ type: Account, description: 'Trade account to Id' })
  accountTo: Account;

  currencyFrom: string;
  currencyTo: string;
  type: RequestTradeType;
  quantity: string;
  limitPrice?: string;
  limitTime?: Date;
}
