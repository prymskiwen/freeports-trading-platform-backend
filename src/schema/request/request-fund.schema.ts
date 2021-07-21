import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, SchemaTypes } from 'mongoose';
import { Account } from '../account/account.schema';
import { InvestorAccount } from '../investor/embedded/investor-account.embedded';
import { Investor } from '../investor/investor.schema';
import { OperationRequest } from '../operation-request/operation-request.schema';
import { User } from '../user/user.schema';
import { RequestStatus } from './request.schema';

export type RequestFundDocument = RequestFund & Document;

@Schema({ versionKey: false })
export class RequestFund {
  kind: string;
  friendlyId: string;
  initiator: User;
  investor: Investor;
  createdAt?: Date;
  modifiedAt?: Date;
  status: RequestStatus;
  approvedBy?: User[];
  requestedOperations?: OperationRequest[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  accountFrom?: InvestorAccount;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  accountTo: Account;

  @Prop()
  quantity: string;
}

export const RequestFundSchema = SchemaFactory.createForClass(RequestFund);

RequestFundSchema.pre<RequestFundDocument>('save', async function () {
  if (!this.isNew) {
    return;
  }

  const model = <Model<RequestFundDocument>>this.constructor;
  const count = await model
    .find({ investor: this.investor })
    .countDocuments()
    .exec();

  this.friendlyId = `FU-${(count + 1).toString().padStart(6, '0')}`;
});
