import { OmitType } from '@nestjs/swagger';
import { User } from 'src/schema/user/user.schema';

export class ReadUserDto extends OmitType(User, ['personal'] as const) {}
