import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Account } from 'src/schema/account/account.schema';
import { User } from 'src/schema/user/user.schema';

@Schema({ versionKey: false, _id: false })
export class AccountOperationDetails {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User' })
  initiator?: User;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  accountFrom?: Account;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  accountId?: Account;

  @Prop()
  amount?: number;

  @Prop()
  createdAt?: Date;

  @Prop()
  operationDate?: Date;

  @Prop()
  operationLabel?: string;

  @Prop()
  thirdParty?: string;

  @Prop()
  lineId?: string;
}

export const AccountOperationDetailsSchema = SchemaFactory.createForClass(
  AccountOperationDetails,
);
