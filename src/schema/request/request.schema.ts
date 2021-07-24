import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, SchemaTypes } from 'mongoose';
import { User } from '../user/user.schema';
import { RequestTrade } from './request-trade.schema';
import { Investor } from '../investor/investor.schema';
import { OperationRequest } from '../operation-request/operation-request.schema';
import { RequestRefund } from './request-refund.schema';
import { RequestFund } from './request-fund.schema';
import { RequestMove } from './request-move.schema';

const friendlyPad = 6;
const friendlyPreffix = {
  [RequestTrade.name]: 'TR',
  [RequestFund.name]: 'FU',
  [RequestRefund.name]: 'RE',
  [RequestMove.name]: 'MO',
};

export enum RequestStatus {
  requesting = 'requesting',
  pending = 'pending', // wait for approve
  approved = 'approved', // approved by security officer
  refused = 'refused', // refused by security officer
  partial = 'partial', // Partially accepted
  acccepted = 'acccepted', // Fully accepted
  processing = 'processing', // Waiting funds
  done = 'done', // Clearer made reconciliation
}

export type RequestDocument = Request & Document;

@Schema({ versionKey: false, discriminatorKey: 'kind', autoIndex: true })
export class Request {
  @Prop({
    type: String,
    required: true,
    enum: [
      RequestTrade.name,
      RequestFund.name,
      RequestRefund.name,
      RequestMove.name,
    ],
  })
  kind: string;

  @Prop()
  friendlyId: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  initiator: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Investor' })
  investor: Investor;

  @Prop()
  quantity: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  modifiedAt?: Date;

  @Prop({ type: String, enum: RequestStatus })
  status: RequestStatus;

  /**
   * Users who approved this request
   * if user count match rules status changes from pending to approved
   */
  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'User' }] })
  approvedBy?: User[];

  @Prop({ type: [{ type: SchemaTypes.ObjectId, ref: 'OperationRequest' }] })
  requestedOperations?: OperationRequest[];
}

export const RequestSchema = SchemaFactory.createForClass(Request);

RequestSchema.index({ investor: 1, friendlyId: 1 }, { unique: true });

RequestSchema.pre<RequestDocument>('save', async function () {
  if (!this.isNew) {
    return;
  }

  const model = <Model<RequestDocument>>this.constructor;
  const count = await model
    .find({ kind: this.kind, investor: this.investor })
    .countDocuments()
    .exec();

  this.friendlyId = `${friendlyPreffix[this.kind]}-${(count + 1)
    .toString()
    .padStart(friendlyPad, '0')}`;
});
