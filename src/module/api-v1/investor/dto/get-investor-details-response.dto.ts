import { ApiProperty } from '@nestjs/swagger';
import { InvestorAccount } from 'src/schema/investor/embedded/investor-account.embedded';
import { GetInvestorResponseDto } from './get-investor-response.dto';

export class GetInvestorDetailsResponseDto extends GetInvestorResponseDto {
  createdAt: Date;

  @ApiProperty({ type: [InvestorAccount] })
  accounts: InvestorAccount[];
}
