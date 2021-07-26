import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  ValidateIf,
} from 'class-validator';
import { RequestTradeType } from 'src/schema/request/request-trade.schema';

export class CreateRequestTradeRequestDto {
  @IsNotEmpty()
  @IsNumberString()
  quantity: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ type: String, description: 'Trade account from Id' })
  accountFrom: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ type: String, description: 'Trade account to Id' })
  accountTo: string;

  @IsNotEmpty()
  @IsEnum(RequestTradeType)
  type: RequestTradeType;

  @ValidateIf((o) => o.type === RequestTradeType.limit)
  @IsNotEmpty()
  limitPrice?: string;

  @ValidateIf((o) => o.type === RequestTradeType.limit)
  @IsNotEmpty()
  @IsDateString()
  limitTime?: Date;
}
