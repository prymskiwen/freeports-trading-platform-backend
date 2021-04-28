import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  TransactionRequestLogs,
  TransactionRequestLogsSchema,
} from './transaction-request-logs.embedded';
import {
  TransactionRequestRequestForQuotesConvertDestination,
  TransactionRequestRequestForQuotesConvertDestinationSchema,
} from './transaction-request-request-for-quotes-convert-destination.embedded';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestForQuotesDetails {
  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  borkerIdentifier: string;

  @Prop({ type: TransactionRequestRequestForQuotesConvertDestinationSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  from: TransactionRequestRequestForQuotesConvertDestination;

  @Prop({ type: TransactionRequestRequestForQuotesConvertDestinationSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  to: TransactionRequestRequestForQuotesConvertDestination;

  @Prop({ type: TransactionRequestLogsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  logs: TransactionRequestLogs;
}

export const TransactionRequestRequestForQuotesDetailsSchema = SchemaFactory.createForClass(
  TransactionRequestRequestForQuotesDetails,
);
