import { CreateRequestResponseDto } from '../dto/create-request-response.dto';
import { RequestDocument } from 'src/schema/request/request.schema';
import { GetRequestTradeResponseDto } from '../dto/trade/get-request-trade-response.dto';
import { RequestTradeDocument } from 'src/schema/request/request-trade.schema';
import { GetRequestTradeDetailsResponseDto } from '../dto/trade/get-request-trade-details-response.dto';
import { InvestorMapper } from '../../investor/mapper/investor.mapper';
import { InvestorDocument } from 'src/schema/investor/investor.schema';
import { DeskMapper } from '../../desk/mapper/desk.mapper';
import { DeskDocument } from 'src/schema/desk/desk.schema';
import { RequestMapper } from './request.mapper';

export class RequestTradeMapper {
  public static toCreateDto(
    document: RequestDocument,
  ): CreateRequestResponseDto {
    const dto = new CreateRequestResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toGetDto(
    document: RequestTradeDocument,
  ): GetRequestTradeResponseDto {
    const dto = Object.assign(
      new GetRequestTradeResponseDto(),
      RequestMapper.toGetDto(document),
    );

    dto.accountFrom = document.accountFrom;
    dto.accountTo = document.accountTo;
    dto.currencyFrom = document.currencyFrom;
    dto.currencyTo = document.currencyTo;
    dto.type = document.type;
    dto.quantity = document.quantity;
    dto.limitPrice = document.limitPrice;
    dto.limitTime = document.limitTime;
    dto.orders = document.orders;

    return dto;
  }

  public static async toGetDetailsDto(
    document: RequestTradeDocument,
  ): Promise<GetRequestTradeDetailsResponseDto> {
    const dto = Object.assign(
      new GetRequestTradeDetailsResponseDto(),
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
