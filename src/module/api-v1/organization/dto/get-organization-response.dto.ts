import { OrganizationClearing } from 'src/schema/organization/embedded/organization-clearing.embedded';
export class GetOrganizationResponseDto {
  id: string;
  name: string;
  createtime: Date;
  commission: number;
  commissionclear: number;
  clearing: OrganizationClearing[];
  acitveUser: number;
  discativeUser: number;
}
