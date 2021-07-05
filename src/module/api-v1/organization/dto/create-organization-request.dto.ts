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

  commissionOrganization?: number;
  commissionClearer?: number;

  vaultOrganizationId?: string;
  vaultRequest: VaultRequestDto;
}
