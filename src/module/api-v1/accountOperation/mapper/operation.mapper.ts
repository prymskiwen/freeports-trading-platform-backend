import { AccountOperationDocument } from "src/schema/account-operation/account-operation.schema";
import { CreateOperationResponseDto } from "../dto/create-operation-response.dto";
import { DeleteOperationResponseDto } from "../dto/delet-operation-response.dto";
import { GetOperationResponseDto } from "../dto/get-operation-response.dto";
import { UpdateOperationResponseDto } from "../dto/update-operation-response.dto";

export class OperationMapper {
  public static toCreateDto(
    document: AccountOperationDocument,
  ): CreateOperationResponseDto {
    const dto = new CreateOperationResponseDto;
    dto.id = document._id;
    return dto;
  }

  public static toUpdateDto(
    document: AccountOperationDocument,
  ): UpdateOperationResponseDto {
    const dto = new UpdateOperationResponseDto;
    dto.id = document._id;
    return dto;
  }

  public static toGetDto(
    document: AccountOperationDocument,
  ): GetOperationResponseDto {
    const dto = new GetOperationResponseDto;
    dto.id = document._id;
    dto.accountFrom = document.details.accountFrom;
    dto.accountId = document.details.accountId;
    dto.amount = document.details.amount;
    dto.createdAt = document.details.createdAt;
    dto.operationDate = document.details.operationDate;
    dto.operationLabel = document.details.operationLabel;
    return dto;
  }

  public static toDeleteDto(
    document: AccountOperationDocument,
  ): DeleteOperationResponseDto {
    const dto = new DeleteOperationResponseDto;
    dto.id = document._id;
    return dto;
  }
}
