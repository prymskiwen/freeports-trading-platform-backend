import { PartialType } from '@nestjs/swagger';
import { CreateRoleDeskMultiRequestDto } from './create-role-desk-multi-request.dto';

export class UpdateRoleDeskMultiRequestDto extends PartialType(
  CreateRoleDeskMultiRequestDto,
) {}
