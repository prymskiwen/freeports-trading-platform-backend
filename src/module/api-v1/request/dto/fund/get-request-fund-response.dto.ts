import { ApiProperty } from '@nestjs/swagger';
import { Account } from 'src/schema/account/account.schema';
import { InvestorAccount } from 'src/schema/investor/embedded/investor-account.embedded';
import { GetRequestResponseDto } from '../get-request-response.dto';

export class GetRequestFundResponseDto extends GetRequestResponseDto {
  @ApiProperty({
    type: InvestorAccount,
    description: 'Investor account from Id or empty',
  })
  accountFrom?: InvestorAccount;

  @ApiProperty({ type: Account, description: 'Trade account to Id' })
  accountTo: Account;
}
