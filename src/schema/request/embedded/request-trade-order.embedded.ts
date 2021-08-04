import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/schema/user/user.schema';
import {
  RequestTradeOrderTradeDocument,
  RequestTradeOrderTradeSchema,
} from './request-trade-order-trade.embedded';
import { RequestTradeRfqSide } from './request-trade-rfq.embedded';

export enum RequestTradeOrderStatus {
  requesting = 'requesting',
  success = 'success',
  failed = 'failed',
}

export enum RequestTradeOrderType {
  fok = 'FOK', // Fill or Kill
  mkt = 'MKT', // Market
}

export type RequestTradeOrderDocument = RequestTradeOrder & Document;

@Schema({ versionKey: false })
export class RequestTradeOrder {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  initiator: User;

  @Prop()
  createdAt?: Date;

  @Prop()
  brokerId: string;

  @Prop({ type: String, enum: RequestTradeOrderStatus })
  status: RequestTradeOrderStatus;

  @Prop()
  rfqId?: string;

  @Prop()
  validUntil: Date;

  @Prop()
  orderId: string;

  @Prop()
  clientOrderId: string;

  @Prop({ type: String, enum: RequestTradeOrderType })
  type: RequestTradeOrderType;

  @Prop()
  quantity: string;

  @Prop({ type: String, enum: RequestTradeRfqSide })
  side: RequestTradeRfqSide;

  /**
   * Tradable from-to currency pairs.
   *
   * @example BTCUSD.SPOT
   */
  @Prop()
  instrument: string;

  /**
   * Price at which you want the order to be executed. Only FOK.
   */
  @Prop()
  price: string;

  /**
   * The field executed_price, in the response,
   * will contain the price at which the trade(s) have been executed,
   * or null if the order was rejected.
   */
  @Prop()
  executedPrice: string;

  /**
   * Tag that the customer can assign to an order to link it to client side logic.
   */
  @Prop()
  executingUnit?: string;

  @Prop()
  rawQuery: string;

  @Prop()
  rawResponse: string;

  @Prop({ type: [RequestTradeOrderTradeSchema] })
  trades?: Types.DocumentArray<RequestTradeOrderTradeDocument>;
}

export const RequestTradeOrderSchema = SchemaFactory.createForClass(
  RequestTradeOrder,
);
