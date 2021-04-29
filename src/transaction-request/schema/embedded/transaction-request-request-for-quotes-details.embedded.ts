import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  borkerIdentifier?: string;

  @Prop({ type: TransactionRequestRequestForQuotesConvertDestinationSchema })
  from?: TransactionRequestRequestForQuotesConvertDestination;

  @Prop({ type: TransactionRequestRequestForQuotesConvertDestinationSchema })
  to?: TransactionRequestRequestForQuotesConvertDestination;

  @Prop({ type: TransactionRequestLogsSchema })
  logs?: TransactionRequestLogs;
}

export const TransactionRequestRequestForQuotesDetailsSchema = SchemaFactory.createForClass(
  TransactionRequestRequestForQuotesDetails,
);
