import { AccountDocument } from "src/schema/account/account.schema";
import { CreateOperationResponseDto } from "../dto/create-operation-response.dto";

export class OperationMapper {
  public static toCreateDto(
    document: AccountDocument,
  ): CreateOperationResponseDto {
    const dto = new CreateOperationResponseDto;
    dto.id = document._id;
    return dto;
  }
}
