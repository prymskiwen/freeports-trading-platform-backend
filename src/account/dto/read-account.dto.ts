import { PartialType } from '@nestjs/swagger';
import { Account } from '../schema/account.schema';

export class ReadAccountDto extends PartialType(Account) {}
