import { IsNotEmpty } from 'class-validator';

export class CreateOperationRequestDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  operationDate: Date;

  @IsNotEmpty()
  operationLabel?: string;

  @IsNotEmpty()
  thirdParty?: string;

  @IsNotEmpty()
  lineId?: string;

  @IsNotEmpty()
  reconciledId?: string;

  accountFrom?: string;
}
