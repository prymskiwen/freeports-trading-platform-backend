import { ApiProperty } from '@nestjs/swagger';
import { Account } from 'src/schema/account/account.schema';
import { InvestorAccount } from 'src/schema/investor/embedded/investor-account.embedded';
import { GetRequestResponseDto } from '../get-request-response.dto';

export class GetRequestRefundResponseDto extends GetRequestResponseDto {
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
