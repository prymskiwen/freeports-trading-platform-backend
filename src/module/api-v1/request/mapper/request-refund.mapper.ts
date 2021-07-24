import { CreateRequestResponseDto } from '../dto/create-request-response.dto';
import { RequestDocument } from 'src/schema/request/request.schema';
import { GetRequestRefundResponseDto } from '../dto/refund/get-request-refund-response.dto';
import { RequestRefundDocument } from 'src/schema/request/request-refund.schema';

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
}
