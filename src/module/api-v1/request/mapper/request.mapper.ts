import { RequestDocument } from 'src/schema/request/request.schema';
import { GetRequestResponseDto } from '../dto/get-request-response.dto';
import { GetRequestOfAccountResponseDto } from '../dto/get-request-of-account-response.dto';
import { RequestFundMapper } from './request-fund.mapper';
import { RequestRefundMapper } from './request-refund.mapper';
import { RequestTradeMapper } from './request-trade.mapper';
import { GetRequestFundDetailsResponseDto } from '../dto/fund/get-request-fund-details-response.dto';
import { GetRequestRefundDetailsResponseDto } from '../dto/refund/get-request-trade-details-response.dto';
import { GetRequestTradeDetailsResponseDto } from '../dto/trade/get-request-trade-details-response.dto';
import {
  RequestFund,
  RequestFundDocument,
} from 'src/schema/request/request-fund.schema';
import {
  RequestRefund,
  RequestRefundDocument,
} from 'src/schema/request/request-refund.schema';
import {
  RequestTrade,
  RequestTradeDocument,
} from 'src/schema/request/request-trade.schema';

export class RequestMapper {
  public static toGetDto(document: RequestDocument): GetRequestResponseDto {
    const dto = new GetRequestResponseDto();

    dto.id = document.id;
    dto.friendlyId = document.friendlyId;
    dto.quantity = document.quantity;
    dto.status = document.status;
    dto.createdAt = document.createdAt;

    return dto;
  }

  public static toGetForAccountDto(
    document: RequestDocument,
  ): GetRequestOfAccountResponseDto {
    const dto = Object.assign(
      new GetRequestOfAccountResponseDto(),
      this.toGetDto(document),
    );

    dto.kind = document.kind;

    return dto;
  }

  public static toGetDetailsForAccountDto(
    document: RequestDocument,
  ): Promise<
    | GetRequestFundDetailsResponseDto
    | GetRequestRefundDetailsResponseDto
    | GetRequestTradeDetailsResponseDto
  > {
    if (document.kind === RequestFund.name) {
      return RequestFundMapper.toGetDetailsDto(document as RequestFundDocument);
    } else if (document.kind === RequestRefund.name) {
      return RequestRefundMapper.toGetDetailsDto(
        document as RequestRefundDocument,
      );
    } else if (document.kind === RequestTrade.name) {
      return RequestTradeMapper.toGetDetailsDto(
        document as RequestTradeDocument,
      );
    }

    return null;
  }
}
