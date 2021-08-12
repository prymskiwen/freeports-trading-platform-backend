import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Account } from 'src/schema/account/account.schema';
import { User } from 'src/schema/user/user.schema';

@Schema({ versionKey: false, _id: false })
export class OperationRequestDetails {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  initiator?: User;

  @Prop()
  createdAt?: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  accountFrom?: Account;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  accountTo?: Account;

  @Prop()
  amount?: number;

  @Prop()
  importId?: number;
}

export const OperationRequestDetailsSchema = SchemaFactory.createForClass(
  OperationRequestDetails,
);
