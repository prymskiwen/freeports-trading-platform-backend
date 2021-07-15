import { ApiProperty } from '@nestjs/swagger';
import { InvestorAccount } from 'src/schema/investor/embedded/investor-account.embedded';

export class GetInvestorDetailsResponseDto {
  id: string;
  name: string;

  @ApiProperty({ type: [InvestorAccount] })
  accounts: InvestorAccount[];
}
