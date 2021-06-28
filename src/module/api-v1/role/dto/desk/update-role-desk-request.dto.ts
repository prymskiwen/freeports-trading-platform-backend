import { PartialType } from '@nestjs/swagger';
import { CreateRoleDeskRequestDto } from './create-role-desk-request.dto';

export class UpdateRoleDeskRequestDto extends PartialType(
  CreateRoleDeskRequestDto,
) {}
