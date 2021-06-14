import { OrganizationClearing } from 'src/schema/organization/embedded/organization-clearing.embedded';
export class GetOrganizationSingleResponseDto {
  id: string;
  name: string;
  logofile: string;
  commission: number;
  commissionclear: number;
  clearing: OrganizationClearing[];
}
