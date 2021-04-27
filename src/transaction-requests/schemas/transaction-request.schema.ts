import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document } from 'mongoose';
import {
  RequestDetails,
  RequestDetailsSchema,
} from './embedded/request-details.embedded';
import {
  Identification,
  IdentificationSchema,
} from './embedded/identification.embedded';
import {
  RequestForQuotes,
  RequestForQuotesSchema,
} from './embedded/request-for-quotes.embedded';
import { Orders, OrdersSchema } from './embedded/orders.embedded';

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

  @Prop({ type: IdentificationSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  identification: Identification;

  @Prop({ type: RequestDetailsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  requestDetails: RequestDetails;

  @Prop({ type: [RequestForQuotesSchema] })
  @ApiProperty({ type: [RequestForQuotes], required: false })
  @IsOptional()
  requestForQuotes: [RequestForQuotes];

  @Prop({ type: [OrdersSchema] })
  @ApiProperty({ type: [Orders], required: false })
  @IsOptional()
  succededOrders: [Orders];

  @Prop({ type: [OrdersSchema] })
  @ApiProperty({ type: [Orders], required: false })
  @IsOptional()
  failedOrders: [Orders];

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  requestedOperations: [];

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  status: string;
}

export const TransactionRequestSchema = SchemaFactory.createForClass(
  TransactionRequest,
);
