import { PartialType } from '@nestjs/swagger';
import { AccountOperation } from '../schema/account-operation.schema';

export class ReadAccountOperationDto extends PartialType(AccountOperation) {}
