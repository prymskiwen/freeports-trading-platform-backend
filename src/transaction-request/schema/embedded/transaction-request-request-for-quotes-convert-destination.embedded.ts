import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestForQuotesConvertDestination {
  @Prop()
  amount?: number;

  @Prop()
  currency?: string;
}

export const TransactionRequestRequestForQuotesConvertDestinationSchema = SchemaFactory.createForClass(
  TransactionRequestRequestForQuotesConvertDestination,
);
