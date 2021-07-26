import { CreateRequestResponseDto } from '../dto/create-request-response.dto';
import { RequestDocument } from 'src/schema/request/request.schema';
import { GetRequestFundResponseDto } from '../dto/fund/get-request-fund-response.dto';
import { RequestFundDocument } from 'src/schema/request/request-fund.schema';

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
}
