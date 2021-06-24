import { ApiProperty } from '@nestjs/swagger';
import { OrganizationClearing } from 'src/schema/organization/embedded/organization-clearing.embedded';
import { GetUserResponseDto } from '../../user/dto/get-user-response.dto';

export class GetOrganizationDetailsResponseDto extends GetUserResponseDto {
  street?: string;
  street2?: string;
  zip?: string;
  city?: string;
  country?: string;
  logo?: string;

  @ApiProperty({ type: [OrganizationClearing] })
  clearing: OrganizationClearing[];
}
