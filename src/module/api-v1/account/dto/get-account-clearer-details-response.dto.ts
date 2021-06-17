import { ApiProperty } from '@nestjs/swagger';

export class GetAccountClearerDetailsResponseDto {
  id: string;
  name: string;
  currency: string;
  type: string;
  iban?: string;
  publicAddress?: string;
  vaultWalletId?: string;

  /**
   * id-s of organizations account assigned to
   */
  @ApiProperty({ type: [String], format: 'ObjectId' })
  organizations: string[];
}
