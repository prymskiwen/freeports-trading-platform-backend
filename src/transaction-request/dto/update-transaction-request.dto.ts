import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateTransactionRequestDto } from './create-transaction-request.dto';

export class UpdateTransactionRequestDto extends PartialType(
  OmitType(CreateTransactionRequestDto, ['identification'] as const),
) {}
