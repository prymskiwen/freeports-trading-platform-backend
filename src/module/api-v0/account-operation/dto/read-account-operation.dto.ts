import { PartialType } from '@nestjs/swagger';
import { AccountOperation } from 'src/schema/account-operation/account-operation.schema';

export class ReadAccountOperationDto extends PartialType(AccountOperation) {}
