import { CreateRequestResponseDto } from '../dto/create-request-response.dto';
import { RequestDocument } from 'src/schema/request/request.schema';
import { GetRequestMoveResponseDto } from '../dto/move/get-request-move-response.dto';
import { RequestMoveDocument } from 'src/schema/request/request-move.schema';
import { GetRequestMoveDetailsResponseDto } from '../dto/move/get-request-move-details-response.dto';
import { InvestorMapper } from '../../investor/mapper/investor.mapper';
import { InvestorDocument } from 'src/schema/investor/investor.schema';
import { DeskMapper } from '../../desk/mapper/desk.mapper';
import { DeskDocument } from 'src/schema/desk/desk.schema';
import { RequestMapper } from './request.mapper';

export class RequestMoveMapper {
  public static toCreateDto(
    document: RequestDocument,
  ): CreateRequestResponseDto {
    const dto = new CreateRequestResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toGetDto(
    document: RequestMoveDocument,
  ): GetRequestMoveResponseDto {
    const dto = Object.assign(
      new GetRequestMoveResponseDto(),
      RequestMapper.toGetDto(document),
    );

    dto.accountFrom = document.accountFrom;
    dto.publicAddressTo = document.publicAddressTo;

    return dto;
  }

  public static async toGetDetailsDto(
    document: RequestMoveDocument,
  ): Promise<GetRequestMoveDetailsResponseDto> {
    const dto = Object.assign(
      new GetRequestMoveDetailsResponseDto(),
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
