import { ApiProperty } from '@nestjs/swagger';
import { AccountInvestor } from 'src/schema/account/account-investor.schema';

export class GetInvestorDetailsResponseDto {
  id: string;
  name: string;

  @ApiProperty({ type: [AccountInvestor] })
  accounts: AccountInvestor[];
}
