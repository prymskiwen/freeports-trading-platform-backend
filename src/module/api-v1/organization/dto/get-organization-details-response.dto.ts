import { ApiProperty } from '@nestjs/swagger';
import { OrganizationClearing } from 'src/schema/organization/embedded/organization-clearing.embedded';
import { GetOrganizationResponseDto } from './get-organization-response.dto';

export class GetOrganizationDetailsResponseDto extends GetOrganizationResponseDto {
  street?: string;
  street2?: string;
  zip?: string;
  city?: string;
  country?: string;
  logo?: string;

  @ApiProperty({ type: [OrganizationClearing] })
  clearing: OrganizationClearing[];
}
