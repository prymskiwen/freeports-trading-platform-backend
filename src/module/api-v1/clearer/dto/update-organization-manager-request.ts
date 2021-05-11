import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateOrganizationManagerRequestDto } from './create-organization-manager-request.dto';

export class UpdateOrganizationManagerRequestDto extends PartialType(
  OmitType(CreateOrganizationManagerRequestDto, ['password'] as const),
) {}
