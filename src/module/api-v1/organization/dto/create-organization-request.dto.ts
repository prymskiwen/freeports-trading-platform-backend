import { IsNotEmpty } from 'class-validator';
import { VaultRequestDto } from '../../vault/dto/vault-request.dto';

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

  vaultOrganizationId?: string;
  vaultRequest: VaultRequestDto;
}
