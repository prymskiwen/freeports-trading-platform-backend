import { CreateRequestResponseDto } from '../dto/create-request-response.dto';
import { RequestDocument } from 'src/schema/request/request.schema';
import { GetRequestTradeResponseDto } from '../dto/trade/get-request-trade-response.dto';
import { RequestTradeDocument } from 'src/schema/request/request-trade.schema';

export class RequestMapper {
  public static toCreateDto(
    document: RequestDocument,
  ): CreateRequestResponseDto {
    const dto = new CreateRequestResponseDto();

    dto.id = document.id;

    return dto;
  }

  public static toGetRequestTradeDto(
    document: RequestTradeDocument,
  ): GetRequestTradeResponseDto {
    const dto = new GetRequestTradeResponseDto();

    dto.id = document.id;
    dto.status = document.status;
    dto.createdAt = document.createdAt;
    dto.accountFrom = document.accountFrom;
    dto.accountTo = document.accountTo;
    dto.currencyFrom = document.currencyFrom;
    dto.currencyTo = document.currencyTo;
    dto.type = document.type;
    dto.quantity = document.quantity;
    dto.limitPrice = document.limitPrice;
    dto.limitTime = document.limitTime;

    return dto;
  }
}
