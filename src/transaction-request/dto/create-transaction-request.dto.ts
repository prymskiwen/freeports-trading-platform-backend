import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsMongoId,
  IsNotEmptyObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';

class IdentificationDTO {
  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'User Id',
  })
  @IsMongoId()
  initiator: string;

  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'User Id',
  })
  @IsMongoId()
  investor: string;
}
export class CreateTransactionRequestDto {
  @IsOptional()
  @IsDateString()
  transactionDate?: Date;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => IdentificationDTO) // <= Mandatory to validate subobject
  identification: IdentificationDTO;
}
