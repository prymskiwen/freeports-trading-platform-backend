export class GetAccountResponseDto {
  id: string;
  name: string;
  currency: string;
  type: string;
  iban?: string;
  publicAddress?: string;
  vaultWalletId?: string;
}
