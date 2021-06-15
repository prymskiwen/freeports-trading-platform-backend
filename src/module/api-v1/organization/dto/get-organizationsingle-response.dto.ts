import { OrganizationClearing } from 'src/schema/organization/embedded/organization-clearing.embedded';
export class GetOrganizationSingleResponseDto {
  id: string;
  name: string;
  createtime: Date;
  logofile: string;
  commission: number;
  commissionclear: number;
  clearing: OrganizationClearing[];
}
