import { ApiProperty } from '@nestjs/swagger';
import { InvestorAccount } from 'src/schema/investor/embedded/investor-account.embedded';
import { RequestStatus } from 'src/schema/request/request.schema';

export class GetRequestMoveResponseDto {
  id: string;
  friendlyId: string;
  quantity: string;
  status: RequestStatus;
  createdAt: Date;

  @ApiProperty({
    type: InvestorAccount,
    description: 'Investor account from Id',
  })
  accountFrom: InvestorAccount;

  publicAddressTo: string;
}
