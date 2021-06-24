import { IsNotEmpty } from 'class-validator';
import { IsUniqueInDb } from 'src/validation/is-unique-in-db.validation';

export class CreateOrganizationRequestDto {
  @IsNotEmpty()
  @IsUniqueInDb({ schema: 'organizations', path: 'details.name' })
  name: string;

  street?: string;
  street2?: string;
  zip?: string;
  city?: string;
  country?: string;
  logo?: string;

  commissionOrganization?: number;
  commissionClearer?: number;
}
