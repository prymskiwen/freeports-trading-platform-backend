import { OmitType } from '@nestjs/swagger';
import { Account } from '../schema/account.schema';

export class CreateAccountDto extends OmitType(Account, ['_id'] as const) {}
