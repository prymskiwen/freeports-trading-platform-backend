import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Account } from 'src/module/account/schema/account.schema';
import { User } from 'src/module/user/schema/user.schema';

@Schema({ versionKey: false, _id: false })
export class OperationRequestDetails {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  initiator?: User;

  @Prop()
  createdAt?: Date;

  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name })
  accountFrom?: Account;

  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name })
  accountTo?: Account;

  @Prop()
  amount?: number;
}

export const OperationRequestDetailsSchema = SchemaFactory.createForClass(
  OperationRequestDetails,
);
