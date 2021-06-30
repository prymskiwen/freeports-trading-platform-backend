export class GetAccountResponseDto {
  id: string;
  name: string;
  currency: string;
  balance: number;
  type: string;
  iban?: string;
  publicAddress?: string;
  vaultWalletId?: string;
}
