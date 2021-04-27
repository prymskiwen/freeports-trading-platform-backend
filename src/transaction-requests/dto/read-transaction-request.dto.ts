import { PartialType } from '@nestjs/swagger';
import { TransactionRequest } from '../schemas/transaction-request.schema';

export class ReadTransactionRequestDto extends PartialType(
  TransactionRequest,
) {}
