import { RequestTradeRfqDocument } from 'src/schema/request/embedded/request-trade-rfq.embedded';
import { GetRequestTradeRfqResponseDto } from '../dto/trade/get-request-trade-rfq-response.dto';

export class RequestTradeRfqMapper {
  public static toGetDto(
    document: RequestTradeRfqDocument,
  ): GetRequestTradeRfqResponseDto {
    const dto = new GetRequestTradeRfqResponseDto();

    dto.id = document.id;
    dto.createdAt = document.createdAt;
    dto.validUntil = document.validUntil;
    dto.quantity = document.quantity;
    dto.side = document.side;
    dto.price = document.price;

    return dto;
  }
}
