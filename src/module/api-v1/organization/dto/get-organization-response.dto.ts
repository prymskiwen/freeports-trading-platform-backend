import { OrganizationClearing } from 'src/schema/organization/embedded/organization-clearing.embedded';
export class GetOrganizationResponseDto {
  id: string;
  name: string;
  commission: number;
  commissionclear: number;
  clearing: OrganizationClearing[];
}
