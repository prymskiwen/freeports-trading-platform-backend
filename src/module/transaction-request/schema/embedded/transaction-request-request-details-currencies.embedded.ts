import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestDetailsCurrencies {
  @Prop()
  from?: string;

  @Prop()
  to?: string;
}

export const TransactionRequestRequestDetailsCurrenciesSchema = SchemaFactory.createForClass(
  TransactionRequestRequestDetailsCurrencies,
);
