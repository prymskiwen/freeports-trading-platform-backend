import { PartialType } from '@nestjs/swagger';
import { TransactionRequest } from 'src/schema/transaction-request/transaction-request.schema';

export class ReadTransactionRequestDto extends PartialType(
  TransactionRequest,
) {}
