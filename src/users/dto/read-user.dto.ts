import { OmitType } from '@nestjs/swagger';
import { User } from '../schemas/user.schema';

export class ReadUserDto extends OmitType(User, ['personal'] as const) {}
