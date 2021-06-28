import { Account } from "src/schema/account/account.schema";

export class GetOperationResponseDto {
  id: string;
  accountId: Account;
  accountFrom: Account;
  amount: number;
  createdAt: Date;
  operationDate: Date;
  operationLabel: string;
}