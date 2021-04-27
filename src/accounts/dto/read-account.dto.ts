import { PartialType } from '@nestjs/swagger';
import { Account } from '../schemas/account.schema';

export class ReadAccountDto extends PartialType(
  Account,
) {}
