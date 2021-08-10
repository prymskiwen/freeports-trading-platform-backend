import { RequestTradeOrderDocument } from 'src/schema/request/embedded/request-trade-order.embedded';
import { RequestTradeRfqDocument } from 'src/schema/request/embedded/request-trade-rfq.embedded';
import { GetRequestTradeOrderResponseDto } from '../dto/trade/get-request-trade-order-response.dto';
import { GetRequestTradeRfqResponseDto } from '../dto/trade/get-request-trade-rfq-response.dto';

export class RequestTradeRfqMapper {
  public static toGetDto(
    document: RequestTradeRfqDocument,
  ): GetRequestTradeRfqResponseDto {
    const dto = new GetRequestTradeRfqResponseDto();

    dto.id = document.id;
    dto.brokerId = document.brokerId || 'N/A';
    dto.createdAt = document.createdAt;
    dto.validUntil = document.validUntil;
    dto.quantity = document.quantity;
    dto.side = document.side;
    dto.price = document.price;

    return dto;
  }
}

export class RequestTradeOrderMapper {
  public static toGetDto(
    document: RequestTradeOrderDocument,
  ): GetRequestTradeOrderResponseDto {
    const dto = new GetRequestTradeOrderResponseDto();

    dto.id = document.id;
    dto.brokerId = document.brokerId || 'N/A';
    dto.createdAt = document.createdAt;
    dto.validUntil = document.validUntil;
    dto.quantity = document.quantity;
    dto.side = document.side;
    dto.price = document.price;
    dto.status = document.status;
    dto.executedPrice = document.executedPrice;

    return dto;
  }
}
