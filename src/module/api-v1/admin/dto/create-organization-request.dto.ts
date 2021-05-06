import { IsNotEmpty } from 'class-validator';
import { IsUniqueInDb } from 'src/validation/is-unique-in-db.validation';

export class CreateOrganizationRequestDto {
  @IsNotEmpty()
  @IsUniqueInDb({ schema: 'organizations', path: 'details.orgName' })
  orgName: string;

  street?: string;
  street2?: string;
  zip?: string;
  city?: string;
  country?: string;
}
