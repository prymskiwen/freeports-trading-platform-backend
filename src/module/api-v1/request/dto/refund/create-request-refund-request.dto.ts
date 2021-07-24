import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class CreateRequestRefundRequestDto {
  @IsNotEmpty()
  @IsNumberString()
  quantity: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ type: String, description: 'Trade account from Id' })
  accountFrom: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({ type: String, description: 'Investor account to Id or empty' })
  accountTo?: string;
}
