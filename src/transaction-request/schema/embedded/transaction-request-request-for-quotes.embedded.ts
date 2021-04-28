import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  TransactionRequestRequestForQuotesCreation,
  TransactionRequestRequestForQuotesCreationSchema,
} from './transaction-request-request-for-quotes-creation.embedded';
import {
  TransactionRequestRequestForQuotesDetails,
  TransactionRequestRequestForQuotesDetailsSchema,
} from './transaction-request-request-for-quotes-details.embedded';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestForQuotes {
  @Prop({ type: TransactionRequestRequestForQuotesCreationSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  creation: TransactionRequestRequestForQuotesCreation;

  @Prop({ type: TransactionRequestRequestForQuotesDetailsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  details: TransactionRequestRequestForQuotesDetails;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  status: string;
}

export const TransactionRequestRequestForQuotesSchema = SchemaFactory.createForClass(
  TransactionRequestRequestForQuotes,
);
