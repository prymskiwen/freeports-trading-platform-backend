import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { User } from 'src/schema/user/user.schema';
import {
  TransactionRequestLogs,
  TransactionRequestLogsSchema,
} from './transaction-request-logs.embedded';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestOrders {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  initiator?: User;

  @Prop()
  createdAt?: Date;

  @Prop()
  rfqId?: string;

  @Prop()
  orderId?: string;

  @Prop({ type: TransactionRequestLogsSchema })
  logs?: TransactionRequestLogs;
}

export const TransactionRequestOrdersSchema = SchemaFactory.createForClass(
  TransactionRequestOrders,
);
