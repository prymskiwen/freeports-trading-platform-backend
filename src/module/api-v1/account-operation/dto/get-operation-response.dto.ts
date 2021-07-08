import { Account } from 'src/schema/account/account.schema';

export class GetOperationResponseDto {
  id: string;
  account: Account;
  type: string;
  amount: number;
  date: Date;
  label: string;
  createdAt: Date;
  reconciledId: string;
}
