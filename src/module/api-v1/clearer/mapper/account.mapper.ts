import { AccountDocument } from 'src/schema/account/account.schema';
import { AccountDetailsType } from 'src/schema/account/embedded/account-details.embedded';
import { CreateOrganizationAccountRequestDto } from '../dto/create-organization-account-request.dto';
import { CreateOrganizationAccountResponseDto } from '../dto/create-organization-account-response.dto';
import { DeleteOrganizationAccountResponseDto } from '../dto/delete-organization-account-response.dto';

export class AccountMapper {
  public static toCreateDocument(
    document: AccountDocument,
    dto: CreateOrganizationAccountRequestDto,
  ): AccountDocument {
    document.details = {
      name: dto.name,
      currency: dto.currency,
      type: dto.type,
    };

    if (dto.type === AccountDetailsType.fiat) {
      document.fiatDetails = {
        iban: dto.iban,
      };
    } else if (dto.type === AccountDetailsType.crypto) {
      document.cryptotDetails = {
        publicAddress: dto.publicAddress,
        vaultWalletId: dto.vaultWalletId,
      };
    }

    return document;
  }

  public static toCreateDto(
    document: AccountDocument,
  ): CreateOrganizationAccountResponseDto {
    const dto = new CreateOrganizationAccountResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toDeleteDto(
    document: AccountDocument,
  ): DeleteOrganizationAccountResponseDto {
    const dto = new DeleteOrganizationAccountResponseDto();

    dto.id = document.id;

    return dto;
  }
}
