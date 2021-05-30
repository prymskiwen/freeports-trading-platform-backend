import { AccountDocument } from 'src/schema/account/account.schema';
import { CreateAccountResponseDto } from '../dto/create-account-response.dto';
import { DeleteAccountResponseDto } from '../dto/delete-account-response.dto';

export class AccountMapper {
  public static toCreateDto(
    document: AccountDocument,
  ): CreateAccountResponseDto {
    const dto = new CreateAccountResponseDto();

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
}
