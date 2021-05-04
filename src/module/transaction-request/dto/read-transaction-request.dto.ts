import { PartialType } from '@nestjs/swagger';
import { TransactionRequest } from '../schema/transaction-request.schema';

export class ReadTransactionRequestDto extends PartialType(
  TransactionRequest,
) {}
