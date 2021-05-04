import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsJSON,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

class CreateAccountOperationDetailsDto {
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

  @IsOptional()
  @IsDateString()
  operationDate?: Date;

  @IsNotEmpty()
  operationLabel: string;
}

class CreateAccountOperationReconciliationDto {
  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'Operation request Id',
  })
  @IsMongoId()
  operationRequest: string;

  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'User Id',
  })
  @IsOptional()
  @IsMongoId()
  reconciliatedBy?: string;

  @IsOptional()
  @IsDateString()
  reconciliatedAt?: Date;
}

class CreateAccountOperationAuditLogDto {
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

export class CreateAccountOperationDto {
  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'User Id',
  })
  @IsMongoId()
  owner: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateAccountOperationDetailsDto)
  details: CreateAccountOperationDetailsDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateAccountOperationReconciliationDto)
  reconciliation?: CreateAccountOperationReconciliationDto;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateAccountOperationAuditLogDto)
  auditLog?: CreateAccountOperationAuditLogDto[];
}
