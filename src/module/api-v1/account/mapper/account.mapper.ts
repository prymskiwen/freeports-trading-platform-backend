import {
  AccountDocument,
  AccountType,
} from 'src/schema/account/account.schema';
import { CreateAccountResponseDto } from '../dto/create-account-response.dto';
import { DeleteAccountResponseDto } from '../dto/delete-account-response.dto';
import { GetAccountDetailsResponseDto } from '../dto/get-account-details-response.dto';
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
    dto.name = document.name;
    dto.currency = document.currency;
    dto.balance = document.balance;
    dto.type = document.type;

    if (document.type === AccountType.fiat) {
      dto.iban = document.iban;
    } else if (document.type === AccountType.crypto) {
      dto.publicAddress = document.publicAddress;
      dto.vaultWalletId = document.vaultWalletId;
      dto.hdPath = document.hdPath;
    }

    return dto;
  }

  public static toGetDetailsDto(
    document: AccountDocument,
  ): GetAccountDetailsResponseDto {
    const dto = Object.assign(
      new GetAccountDetailsResponseDto(),
      this.toGetDto(document),
    );

    dto.organizations = document.organizations;

    return dto;
  }
}
