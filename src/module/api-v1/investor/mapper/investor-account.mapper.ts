import { AccountDocument } from 'src/schema/account/account.schema';
import { InvestorAccountDocument } from 'src/schema/investor/embedded/investor-account.embedded';
import { AssignInvestorAccountResponseDto } from '../dto/account/assign-investor-account-response.dto';
import { GetInvestorAccountResponseDto } from '../dto/account/get-investor-account-response.dto';
import { UnassignInvestorAccountResponseDto } from '../dto/account/unassign-investor-account-response.dto';

export class InvestorAccountMapper {
  public static toAssignDto(
    document: InvestorAccountDocument,
  ): AssignInvestorAccountResponseDto {
    const dto = new AssignInvestorAccountResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toUnassignDto(
    document: AccountDocument,
  ): UnassignInvestorAccountResponseDto {
    const dto = new UnassignInvestorAccountResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toGetDto(
    document: InvestorAccountDocument,
  ): GetInvestorAccountResponseDto {
    const dto = new GetInvestorAccountResponseDto();

    dto.id = document.id;
    dto.name = document.name;
    dto.currency = document.currency;
    dto.balance = document.balance;
    dto.publicAddress = document.publicAddress;
    dto.vaultWalletId = document.vaultWalletId;
    dto.hdPath = document.hdPath;

    return dto;
  }
}
