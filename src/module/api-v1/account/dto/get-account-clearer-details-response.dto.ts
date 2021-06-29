import { ApiProperty } from '@nestjs/swagger';
import { Organization } from 'src/schema/organization/organization.schema';

export class GetAccountClearerDetailsResponseDto {
  id: string;
  name: string;
  currency: string;
  balance: number;
  type: string;
  iban?: string;
  publicAddress?: string;
  vaultWalletId?: string;

  @ApiProperty({ type: [Organization] })
  organizations: Organization[];
}
