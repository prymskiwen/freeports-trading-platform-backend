import { CreateRequestResponseDto } from '../dto/create-request-response.dto';
import { RequestDocument } from 'src/schema/request/request.schema';
import { GetRequestFundResponseDto } from '../dto/fund/get-request-fund-response.dto';
import { RequestFundDocument } from 'src/schema/request/request-fund.schema';
import { GetRequestFundDetailsResponseDto } from '../dto/fund/get-request-fund-details-response.dto';
import { InvestorMapper } from '../../investor/mapper/investor.mapper';
import { InvestorDocument } from 'src/schema/investor/investor.schema';
import { DeskDocument } from 'src/schema/desk/desk.schema';
import { DeskMapper } from '../../desk/mapper/desk.mapper';

export class RequestFundMapper {
  public static toCreateDto(
    document: RequestDocument,
  ): CreateRequestResponseDto {
    const dto = new CreateRequestResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toGetDto(
    document: RequestFundDocument,
  ): GetRequestFundResponseDto {
    const dto = new GetRequestFundResponseDto();

    dto.id = document.id;
    dto.friendlyId = document.friendlyId;
    dto.quantity = document.quantity;
    dto.status = document.status;
    dto.createdAt = document.createdAt;
    dto.accountFrom = document.accountFrom;
    dto.accountTo = document.accountTo;

    return dto;
  }

  public static async toGetDetailsDto(
    document: RequestFundDocument,
  ): Promise<GetRequestFundDetailsResponseDto> {
    const dto = Object.assign(
      new GetRequestFundDetailsResponseDto(),
      this.toGetDto(document),
    );

    await document.populate('investor').execPopulate();
    dto.investor = InvestorMapper.toGetDto(
      document.investor as InvestorDocument,
    );

    await document
      .populate({ path: 'investor', populate: { path: 'desk' } })
      .execPopulate();
    dto.desk = DeskMapper.toGetDto(document.investor.desk as DeskDocument);

    return dto;
  }
}
