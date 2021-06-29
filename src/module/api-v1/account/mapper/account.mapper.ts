import { AccountClearerDocument } from 'src/schema/account/account-clearer.schema';
import { AccountDocument } from 'src/schema/account/account.schema';
import { AccountDetailsType } from 'src/schema/account/embedded/account-details.embedded';
import { CreateAccountResponseDto } from '../dto/create-account-response.dto';
import { DeleteAccountResponseDto } from '../dto/delete-account-response.dto';
import { GetAccountClearerDetailsResponseDto } from '../dto/get-account-clearer-details-response.dto';
import { GetAccountResponseDto } from '../dto/get-account-response.dto';
import { AssignAccountResponseDto } from '../dto/assign-account-response.dto';
import { UpdateAccountResponseDto } from '../dto/update-account-response.dto';
import { UnassignAccountResponseDto } from '../dto/unassign-account-response.dto';

export class AccountMapper {
  public static toCreateDto(
    document: AccountDocument,
  ): CreateAccountResponseDto {
    const dto = new CreateAccountResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toUpdateDto(
    document: AccountDocument,
  ): UpdateAccountResponseDto {
    const dto = new UpdateAccountResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toDeleteDto(
    document: AccountDocument,
  ): DeleteAccountResponseDto {
    const dto = new DeleteAccountResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toAssignDto(
    document: AccountDocument,
  ): AssignAccountResponseDto {
    const dto = new AssignAccountResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toUnassignDto(
    document: AccountDocument,
  ): UnassignAccountResponseDto {
    const dto = new UnassignAccountResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toGetDto(document: AccountDocument): GetAccountResponseDto {
    const dto = new GetAccountResponseDto();

    dto.id = document.id;
    dto.name = document.details.name;
    dto.currency = document.details.currency;
    dto.balance = document.details.balance;
    dto.type = document.details.type;

    if (document.details.type === AccountDetailsType.fiat) {
      dto.iban = document.fiatDetails.iban;
    } else if (document.details.type === AccountDetailsType.crypto) {
      dto.publicAddress = document.cryptotDetails.publicAddress;
      dto.vaultWalletId = document.cryptotDetails.vaultWalletId;
    }

    return dto;
  }

  public static toGetAccountClearerDetailsDto(
    document: AccountClearerDocument,
  ): GetAccountClearerDetailsResponseDto {
    const dto = new GetAccountClearerDetailsResponseDto();

    dto.id = document.id;
    dto.name = document.details.name;
    dto.currency = document.details.currency;
    dto.balence = document.details.balance;
    dto.type = document.details.type;

    if (document.details.type === AccountDetailsType.fiat) {
      dto.iban = document.fiatDetails.iban;
    } else if (document.details.type === AccountDetailsType.crypto) {
      dto.publicAddress = document.cryptotDetails.publicAddress;
      dto.vaultWalletId = document.cryptotDetails.vaultWalletId;
    }

    dto.organizations = document.organizations;

    return dto;
  }
}
