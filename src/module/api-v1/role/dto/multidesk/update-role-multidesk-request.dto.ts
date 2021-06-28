import { PartialType } from '@nestjs/swagger';
import { CreateRoleMultideskRequestDto } from './create-role-multidesk-request.dto';

export class UpdateRoleMultideskRequestDto extends PartialType(
  CreateRoleMultideskRequestDto,
) {}
