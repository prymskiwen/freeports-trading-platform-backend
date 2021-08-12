import { IsEnum, IsNotEmpty } from 'class-validator';
import { AccountOperationDetailsType } from 'src/schema/account-operation/embedded/account-operation-details.embedded';

export class CreateOperationRequestDto {
  @IsNotEmpty()
  amount: number;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  label?: string;

  @IsNotEmpty()
  @IsEnum(AccountOperationDetailsType)
  type: AccountOperationDetailsType;

  importId?: string;
}
