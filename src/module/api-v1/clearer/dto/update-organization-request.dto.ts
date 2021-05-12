import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationRequestDto } from './create-organization-request.dto';

export class UpdateOrganizationRequestDto extends PartialType(
  CreateOrganizationRequestDto,
) {}
