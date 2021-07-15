import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { User } from 'src/schema/user/user.schema';

export enum RequestTradeRfqType {
  buy = 'buy',
  sale = 'sale',
}

export type RequestTradeRfqDocument = RequestTradeRfq & Document;

@Schema({ versionKey: false })
export class RequestTradeRfq {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  initiator: User;

  @Prop()
  createdAt?: Date;

  @Prop()
  brokerId: string;

  @Prop()
  validUntil: Date;

  @Prop()
  rfqId: string;

  @Prop()
  clientRfqId: string;

  @Prop()
  quantity: string;

  @Prop({ type: String, enum: RequestTradeRfqType })
  side: RequestTradeRfqType;

  /**
   * tradable from-to currency pairs
   *
   * @example BTCUSD.SPOT
   */
  @Prop()
  instrument: string;

  @Prop()
  price: string;

  @Prop()
  rawQuery: string;

  @Prop()
  rawResponse: string;
}

export const RequestTradeRfqSchema = SchemaFactory.createForClass(
  RequestTradeRfq,
);