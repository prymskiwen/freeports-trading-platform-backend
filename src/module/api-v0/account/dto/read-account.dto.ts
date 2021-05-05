import { PartialType } from '@nestjs/swagger';
import { Account } from 'src/schema/account/account.schema';

export class ReadAccountDto extends PartialType(Account) {}
