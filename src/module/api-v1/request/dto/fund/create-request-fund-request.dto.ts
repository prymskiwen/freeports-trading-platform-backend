import { ApiProperty } from '@nestjs/swagger';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';

export class CreateRequestFundRequestDto {
  @IsNotEmpty()
  @IsNumberString()
  quantity: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    type: String,
    description: 'Investor account from Id or empty',
  })
  accountFrom?: string;

  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({ type: String, description: 'Trade account to Id' })
  accountTo: string;
}
