import { IsEnum, IsNotEmpty, ValidateIf } from "class-validator";

export class CreateOperationRequestDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  createAt: Date;

  @IsNotEmpty()
  operationDate: Date;

  @IsNotEmpty()
  operationLabel: string;

  @IsNotEmpty()
  thirdParty?: string;

  @IsNotEmpty()
  lineId?: string;

  accountFrom?: string;
}

