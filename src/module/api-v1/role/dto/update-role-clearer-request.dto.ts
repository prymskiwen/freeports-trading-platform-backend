import { PartialType } from '@nestjs/swagger';
import { CreateRoleClearerRequestDto } from './create-role-clearer-request.dto';

export class UpdateRoleClearerRequestDto extends PartialType(
  CreateRoleClearerRequestDto,
) {}
