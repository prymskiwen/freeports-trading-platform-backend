import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestLogs {
  @Prop()
  rawBrokerQuery?: string;

  @Prop()
  rawBrokerResponse?: string;

  @Prop()
  statusCode?: string;

  @Prop()
  rfqId?: string;
}

export const TransactionRequestLogsSchema = SchemaFactory.createForClass(
  TransactionRequestLogs,
);
