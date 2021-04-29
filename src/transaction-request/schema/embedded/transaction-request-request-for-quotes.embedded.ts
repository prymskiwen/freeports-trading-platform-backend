import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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
  creation?: TransactionRequestRequestForQuotesCreation;

  @Prop({ type: TransactionRequestRequestForQuotesDetailsSchema })
  details?: TransactionRequestRequestForQuotesDetails;

  @Prop()
  status?: string;
}

export const TransactionRequestRequestForQuotesSchema = SchemaFactory.createForClass(
  TransactionRequestRequestForQuotes,
);
