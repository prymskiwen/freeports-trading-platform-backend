import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Account } from 'src/schema/account/account.schema';
import { User } from 'src/schema/user/user.schema';

export enum AccountOperationDetailsType {
  credit = 'credit',
  debit = 'debit',
}

@Schema({ versionKey: false, _id: false })
export class AccountOperationDetails {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  initiator?: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  account: Account;

  @Prop({ type: String, enum: AccountOperationDetailsType })
  type?: AccountOperationDetailsType;

  @Prop()
  label?: string;

  @Prop()
  amount?: number;

  @Prop()
  date?: Date;

  @Prop()
  createdAt?: Date;

  @Prop()
  importId?: string;
}

export const AccountOperationDetailsSchema = SchemaFactory.createForClass(
  AccountOperationDetails,
);
