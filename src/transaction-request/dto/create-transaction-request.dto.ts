import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import {
  TransactionRequestRequestDetailsMode,
  TransactionRequestRequestDetailsType,
} from '../schema/embedded/transaction-request-request-details.embedded';
import { TransactionRequestDocumentStatus } from '../schema/transaction-request.schema';

class CreateTransactionRequestIdentificationDto {
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

class CreateTransactionRequestRequestDetailsCurrenciesDto {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;
}

class CreateTransactionRequestRequestDetailsClearingMoveAccounts {
  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'Account Id',
  })
  @IsMongoId()
  from: string;

  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'Account Id',
  })
  @IsMongoId()
  to: string;
}

class CreateTransactionRequestRequestDetailsSaleDto {
  @IsNumber()
  nbTokens: number;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTransactionRequestRequestDetailsCurrenciesDto)
  currencies: CreateTransactionRequestRequestDetailsCurrenciesDto;

  @IsNumber()
  minimalUnitPrice: number;
}

class CreateTransactionRequestRequestDetailsPurchaseDto {
  @IsNumber()
  nbTokens: number;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTransactionRequestRequestDetailsCurrenciesDto)
  currencies: CreateTransactionRequestRequestDetailsCurrenciesDto;

  @IsNumber()
  maximalUnitPrice: number;
}

class CreateTransactionRequestRequestDetailsClearingMoveDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTransactionRequestRequestDetailsClearingMoveAccounts)
  accounts: CreateTransactionRequestRequestDetailsClearingMoveAccounts;

  @IsNumber()
  amount: number;
}

class CreateTransactionRequestRequestDetailsAssetsMoveDto {
  @IsNotEmpty()
  vaultWalletId: string;

  @IsNotEmpty()
  publicTargetWalletId: string;

  @IsNotEmpty()
  currency: string;
}

class CreateTransactionRequestRequestDetailsDto {
  @IsEnum(TransactionRequestRequestDetailsType)
  type: TransactionRequestRequestDetailsType;

  @IsEnum(TransactionRequestRequestDetailsMode)
  mode: TransactionRequestRequestDetailsMode;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTransactionRequestRequestDetailsSaleDto)
  sale?: CreateTransactionRequestRequestDetailsSaleDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTransactionRequestRequestDetailsPurchaseDto)
  purchase?: CreateTransactionRequestRequestDetailsPurchaseDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTransactionRequestRequestDetailsClearingMoveDto)
  clearingMove?: CreateTransactionRequestRequestDetailsClearingMoveDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTransactionRequestRequestDetailsAssetsMoveDto)
  assetsMove?: CreateTransactionRequestRequestDetailsAssetsMoveDto;
}

class CreateTransactionRequestRequestForQuotesCreationDto {
  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'User Id',
  })
  @IsMongoId()
  initiator: string;

  @IsOptional()
  @IsDateString()
  createdAt?: Date;
}

class CreateTransactionRequestRequestForQuotesConvertDestinationSchemaDto {
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  currency: string;
}

class CreateTransactionRequestLogsDto {
  @IsNotEmpty()
  rawBrokerQuery: string;

  @IsNotEmpty()
  rawBrokerResponse: string;

  @IsNotEmpty()
  statusCode: string;

  @IsNotEmpty()
  rfqId: string;
}

class CreateTransactionRequestRequestForQuotesDetailsDto {
  @IsNotEmpty()
  brokerIdentifier: string;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(
    () => CreateTransactionRequestRequestForQuotesConvertDestinationSchemaDto,
  )
  from: CreateTransactionRequestRequestForQuotesConvertDestinationSchemaDto;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(
    () => CreateTransactionRequestRequestForQuotesConvertDestinationSchemaDto,
  )
  to: CreateTransactionRequestRequestForQuotesConvertDestinationSchemaDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTransactionRequestLogsDto)
  logs?: CreateTransactionRequestLogsDto;
}

class CreateTransactionRequestRequestForQuotesDto {
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTransactionRequestRequestForQuotesCreationDto)
  creation?: CreateTransactionRequestRequestForQuotesCreationDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTransactionRequestRequestForQuotesDetailsDto)
  details?: CreateTransactionRequestRequestForQuotesDetailsDto;

  @IsOptional()
  status?: string;
}

class CreateTransactionRequestOrdersDto {
  @ApiProperty({
    format: 'ObjectId',
    pattern: '/^[a-f\\d]{24}$/',
    description: 'User Id',
  })
  @IsMongoId()
  initiator?: string;

  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @IsOptional()
  rfqId?: string;

  @IsOptional()
  orderId?: string;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTransactionRequestLogsDto)
  logs?: CreateTransactionRequestLogsDto;
}

export class CreateTransactionRequestDto {
  @IsOptional()
  @IsDateString()
  transactionDate?: Date;

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTransactionRequestIdentificationDto) // <= Mandatory to validate subobject
  identification: CreateTransactionRequestIdentificationDto;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateTransactionRequestRequestDetailsDto) // <= Mandatory to validate subobject
  requestDetails?: CreateTransactionRequestRequestDetailsDto;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionRequestRequestForQuotesDto)
  requestForQuotes?: CreateTransactionRequestRequestForQuotesDto[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionRequestOrdersDto)
  succededOrders?: CreateTransactionRequestOrdersDto[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionRequestOrdersDto)
  failedOrders?: CreateTransactionRequestOrdersDto[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'ObjectId',
      pattern: '/^[a-f\\d]{24}$/',
      description: 'Operation request Id',
    },
  })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  requestedOperations?: string[];

  @IsOptional()
  @IsEnum(TransactionRequestDocumentStatus)
  status?: TransactionRequestDocumentStatus;
}
