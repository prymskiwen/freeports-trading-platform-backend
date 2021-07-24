import { CreateRequestResponseDto } from '../dto/create-request-response.dto';
import { RequestDocument } from 'src/schema/request/request.schema';
import { GetRequestMoveResponseDto } from '../dto/move/get-request-move-response.dto';
import { RequestMoveDocument } from 'src/schema/request/request-move.schema';

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
    const dto = new GetRequestMoveResponseDto();

    dto.id = document.id;
    dto.friendlyId = document.friendlyId;
    dto.quantity = document.quantity;
    dto.status = document.status;
    dto.createdAt = document.createdAt;
    dto.accountFrom = document.accountFrom;
    dto.publicAddressTo = document.publicAddressTo;

    return dto;
  }
}
