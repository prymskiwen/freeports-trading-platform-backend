import { PartialType } from '@nestjs/swagger';
import { CreateAccountOperationDto } from './create-account-operation.dto';

export class UpdateAccountOperationDto extends PartialType(
  CreateAccountOperationDto,
) {}
