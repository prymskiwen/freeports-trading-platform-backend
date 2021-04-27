import { OmitType } from '@nestjs/swagger';
import { TransactionRequest } from '../schemas/transaction-request.schema';

export class CreateTransactionRequestDto extends OmitType(TransactionRequest, [
  '_id',
] as const) {}
