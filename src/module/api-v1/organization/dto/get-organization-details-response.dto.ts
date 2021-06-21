import { OrganizationClearing } from 'src/schema/organization/embedded/organization-clearing.embedded';

export class GetOrganizationDetailsResponseDto {
  id: string;
  name: string;
  createtime: Date;
  logofile: string;
  commission: number;
  commissionclear: number;
  clearing: OrganizationClearing[];
  acitveUser: number;
  discativeUser: number;
}
