import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Account } from 'src/account/schema/account.schema';
import { User } from 'src/user/schema/user.schema';

@Schema({ versionKey: false, _id: false })
export class AccountOperationDetails {
  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  initiator?: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name })
  accountFrom?: Account;

  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name })
  accountTo?: Account;

  @Prop()
  amount?: number;

  @Prop()
  createdAt?: Date;

  @Prop()
  operationDate?: Date;

  @Prop()
  operationLabel?: string;
}

export const AccountOperationDetailsSchema = SchemaFactory.createForClass(
  AccountOperationDetails,
);
