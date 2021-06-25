import { AccountOperationDocument } from "src/schema/account-operation/account-operation.schema";
import { CreateOperationResponseDto } from "../dto/create-operation-response.dto";

export class OperationMapper {
  public static toCreateDto(
    document: AccountOperationDocument,
  ): CreateOperationResponseDto {
    const dto = new CreateOperationResponseDto;
    dto.id = document._id;
    return dto;
  }
}
