import { PartialType } from '@nestjs/swagger';
import { CreateRoleOrganizationRequestDto } from './create-role-organization-request.dto';

export class UpdateRoleOrganizationRequestDto extends PartialType(
  CreateRoleOrganizationRequestDto,
) {}
