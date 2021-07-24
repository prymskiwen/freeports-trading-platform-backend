import { ApiProperty } from '@nestjs/swagger';
import { Account } from 'src/schema/account/account.schema';
import { InvestorAccount } from 'src/schema/investor/embedded/investor-account.embedded';
import { RequestStatus } from 'src/schema/request/request.schema';

export class GetRequestRefundResponseDto {
  id: string;
  friendlyId: string;
  quantity: string;
  status: RequestStatus;
  createdAt: Date;

  @ApiProperty({
    type: Account,
    description: 'Trade account from Id',
  })
  accountFrom: Account;

  @ApiProperty({
    type: InvestorAccount,
    description: 'Investor account to Id or empty',
  })
  accountTo?: InvestorAccount;
}
