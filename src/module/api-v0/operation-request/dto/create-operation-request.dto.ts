import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsJSON,
  IsMongoId,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

class CreateOperationRequestDetailsDto {
  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'User Id',
  })
  @IsOptional()
  @IsMongoId()
  initiator?: string;

  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'Account Id',
  })
  @IsMongoId()
  accountFrom: string;

  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'Account Id',
  })
  @IsMongoId()
  accountTo: string;

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsDateString()
  createdAt?: Date;
}

class OperationRequestAuditLogDto {
  @IsOptional()
  @IsDateString()
  editedAt?: Date;

  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'User Id',
  })
  @IsOptional()
  @IsMongoId()
  editedBy?: string;

  @IsJSON()
  jsonUpdate: string;
}

export class CreateOperationRequestDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateOperationRequestDetailsDto)
  details: CreateOperationRequestDetailsDto;

  @IsOptional()
  @IsBoolean()
  processed?: boolean;

  @IsOptional()
  @IsBoolean()
  confirmed?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OperationRequestAuditLogDto)
  auditLog?: OperationRequestAuditLogDto[];
}
