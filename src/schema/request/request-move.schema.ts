import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model, SchemaTypes } from 'mongoose';
import { InvestorAccount } from '../investor/embedded/investor-account.embedded';
import { Investor } from '../investor/investor.schema';
import { OperationRequest } from '../operation-request/operation-request.schema';
import { User } from '../user/user.schema';
import { RequestStatus } from './request.schema';

export type RequestMoveDocument = RequestMove & Document;

@Schema({ versionKey: false })
export class RequestMove {
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

  @Prop()
  publicAddressTo?: string;

  @Prop()
  quantity: string;
}

export const RequestMoveSchema = SchemaFactory.createForClass(RequestMove);

RequestMoveSchema.pre<RequestMoveDocument>('save', async function () {
  if (!this.isNew) {
    return;
  }

  const model = <Model<RequestMoveDocument>>this.constructor;
  const count = await model
    .find({ investor: this.investor })
    .countDocuments()
    .exec();

  this.friendlyId = `MO-${(count + 1).toString().padStart(6, '0')}`;
});
