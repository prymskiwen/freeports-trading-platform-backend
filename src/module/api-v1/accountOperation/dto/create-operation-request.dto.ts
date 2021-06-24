import { IsEnum, IsNotEmpty, ValidateIf } from "class-validator";
import { Account } from "src/schema/account/account.schema";

export class CreateOperationRequestDto {
  @IsNotEmpty()
  reference: string;

  @IsNotEmpty()
  createTime?: Date;

  @IsNotEmpty()
  value: string;

  thirdParty?: Account;

}

