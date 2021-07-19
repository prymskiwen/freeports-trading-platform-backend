import { IsNotEmpty } from 'class-validator';

export class CreateOrganizationRequestDto {
  @IsNotEmpty()
  name: string;

  street?: string;
  street2?: string;
  zip?: string;
  city?: string;
  country?: string;
  logo?: string;

  commissionOrganization?: string;
  commissionClearer?: string;
}
