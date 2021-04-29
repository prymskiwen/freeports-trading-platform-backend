import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  TransactionRequestRequestDetailsCurrencies,
  TransactionRequestRequestDetailsCurrenciesSchema,
} from './transaction-request-request-details-currencies.embedded';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestDetailsSale {
  @Prop()
  nbTokens?: number;

  @Prop({ type: TransactionRequestRequestDetailsCurrenciesSchema })
  currencies?: TransactionRequestRequestDetailsCurrencies;

  @Prop()
  minimalUnitPrice?: number;
}

export const TransactionRequestRequestDetailsSaleSchema = SchemaFactory.createForClass(
  TransactionRequestRequestDetailsSale,
);
