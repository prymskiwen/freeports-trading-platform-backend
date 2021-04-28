import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document, SchemaTypes } from 'mongoose';
import {
  TransactionRequestRequestDetails,
  TransactionRequestRequestDetailsSchema,
} from './embedded/transaction-request-request-details.embedded';
import {
  TransactionRequestIdentification,
  TransactionRequestIdentificationSchema,
} from './embedded/transaction-request-identification.embedded';
import {
  TransactionRequestRequestForQuotes,
  TransactionRequestRequestForQuotesSchema,
} from './embedded/transaction-request-request-for-quotes.embedded';
import {
  TransactionRequestOrders,
  TransactionRequestOrdersSchema,
} from './embedded/transaction-request-orders.embedded';
import { OperationRequest } from 'src/operation-request/schema/operation-request.schema';

export type TransactionRequestDocument = TransactionRequest & Document;

@Schema({ versionKey: false })
export class TransactionRequest {
  @ApiProperty({ required: false })
  @IsOptional()
  _id: string;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  transactionDate: Date;

  @Prop({ type: TransactionRequestIdentificationSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  identification: TransactionRequestIdentification;

  @Prop({ type: TransactionRequestRequestDetailsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  requestDetails: TransactionRequestRequestDetails;

  @Prop({ type: [TransactionRequestRequestForQuotesSchema] })
  @ApiProperty({ type: [TransactionRequestRequestForQuotes], required: false })
  @IsOptional()
  requestForQuotes: [TransactionRequestRequestForQuotes];

  @Prop({ type: [TransactionRequestOrdersSchema] })
  @ApiProperty({ type: [TransactionRequestOrders], required: false })
  @IsOptional()
  succededOrders: [TransactionRequestOrders];

  @Prop({ type: [TransactionRequestOrdersSchema] })
  @ApiProperty({ type: [TransactionRequestOrders], required: false })
  @IsOptional()
  failedOrders: [TransactionRequestOrders];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: OperationRequest.name }] })
  @ApiProperty({ type: () => [OperationRequest], required: false })
  @IsOptional()
  requestedOperations: OperationRequest[];

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  status: string;
}

export const TransactionRequestSchema = SchemaFactory.createForClass(
  TransactionRequest,
);
