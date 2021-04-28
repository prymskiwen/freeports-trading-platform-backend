import { OmitType } from '@nestjs/swagger';
import { User } from '../schema/user.schema';

export class CreateUserDto extends OmitType(User, [
  '_id',
  'vault_user_id',
  'roles',
] as const) {}
