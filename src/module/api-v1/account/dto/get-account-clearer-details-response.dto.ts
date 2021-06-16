export class GetAccountClearerDetailsResponseDto {
  id: string;
  name: string;
  currency: string;
  type: string;
  iban?: string;
  publicAddress?: string;
  vaultWalletId?: string;
  organizations: string[];
}
