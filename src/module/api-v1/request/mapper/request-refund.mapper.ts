import { CreateRequestResponseDto } from '../dto/create-request-response.dto';
import { RequestDocument } from 'src/schema/request/request.schema';
import { GetRequestRefundResponseDto } from '../dto/refund/get-request-refund-response.dto';
import { RequestRefundDocument } from 'src/schema/request/request-refund.schema';
import { GetRequestRefundDetailsResponseDto } from '../dto/refund/get-request-trade-details-response.dto';
import { InvestorMapper } from '../../investor/mapper/investor.mapper';
import { InvestorDocument } from 'src/schema/investor/investor.schema';
import { DeskMapper } from '../../desk/mapper/desk.mapper';
import { DeskDocument } from 'src/schema/desk/desk.schema';

export class RequestRefundMapper {
  public static toCreateDto(
    document: RequestDocument,
  ): CreateRequestResponseDto {
    const dto = new CreateRequestResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toGetDto(
    document: RequestRefundDocument,
  ): GetRequestRefundResponseDto {
    const dto = new GetRequestRefundResponseDto();

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
    document: RequestRefundDocument,
  ): Promise<GetRequestRefundDetailsResponseDto> {
    const dto = Object.assign(
      new GetRequestRefundDetailsResponseDto(),
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
