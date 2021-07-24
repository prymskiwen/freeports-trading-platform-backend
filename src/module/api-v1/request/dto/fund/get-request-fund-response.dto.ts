import { ApiProperty } from '@nestjs/swagger';
import { Account } from 'src/schema/account/account.schema';
import { InvestorAccount } from 'src/schema/investor/embedded/investor-account.embedded';
import { RequestStatus } from 'src/schema/request/request.schema';

export class GetRequestFundResponseDto {
  id: string;
  friendlyId: string;
  quantity: string;
  status: RequestStatus;
  createdAt: Date;

  @ApiProperty({
    type: InvestorAccount,
    description: 'Investor account from Id or empty',
  })
  accountFrom?: InvestorAccount;

  @ApiProperty({ type: Account, description: 'Trade account to Id' })
  accountTo: Account;
}
