import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RequestTradeOrderTradeDocument = RequestTradeOrderTrade & Document;

@Schema({ versionKey: false })
export class RequestTradeOrderTrade {
  @Prop()
  tradeId?: string;

  @Prop()
  origin?: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  price: string;

  @Prop()
  quantity: string;
}

export const RequestTradeOrderTradeSchema = SchemaFactory.createForClass(
  RequestTradeOrderTrade,
);
