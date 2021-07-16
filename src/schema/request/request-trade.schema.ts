import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { Account } from '../account/account.schema';
import { Investor } from '../investor/investor.schema';
import { OperationRequest } from '../operation-request/operation-request.schema';
import { User } from '../user/user.schema';
import {
  RequestTradeRfqDocument,
  RequestTradeRfqSchema,
} from './embedded/request-trade-rfq.embedded';
import { RequestStatus } from './request.schema';

export enum RequestTradeType {
  limit = 'limit',
  market = 'market',
  manual = 'manual',
}

export type RequestTradeDocument = RequestTrade & Document;

@Schema({ versionKey: false })
export class RequestTrade {
  kind: string;
  initiator: User;
  investor: Investor;
  createdAt?: Date;
  modifiedAt?: Date;
  status: RequestStatus;
  approvedBy?: User[];
  requestedOperations?: OperationRequest[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  accountFrom: Account;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  accountTo: Account;

  @Prop()
  currencyFrom?: string;

  @Prop()
  currencyTo?: string;

  @Prop({ type: String, enum: RequestTradeType })
  type: RequestTradeType;

  @Prop()
  limitPrice?: string;

  @Prop()
  limitTime?: Date;

  @Prop()
  quantity: string;

  @Prop()
  commissionClearer: string;

  @Prop()
  commissionOrganization: string;

  @Prop()
  priceForInvestor: string;

  @Prop({ type: [RequestTradeRfqSchema] })
  rfq?: Types.DocumentArray<RequestTradeRfqDocument>;
}

export const RequestTradeSchema = SchemaFactory.createForClass(RequestTrade);
