import { ApiProperty } from '@nestjs/swagger';
import { InvestorAccount } from 'src/schema/investor/embedded/investor-account.embedded';
import { GetRequestResponseDto } from '../get-request-response.dto';

export class GetRequestMoveResponseDto extends GetRequestResponseDto {
  @ApiProperty({
    type: InvestorAccount,
    description: 'Investor account from Id',
  })
  accountFrom: InvestorAccount;

  publicAddressTo: string;
}
