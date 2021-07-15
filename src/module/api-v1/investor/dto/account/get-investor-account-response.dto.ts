export class GetInvestorAccountResponseDto {
  id: string;
  name: string;
  currency: string;
  balance: number;
  publicAddress?: string;
  vaultWalletId?: string;
}
