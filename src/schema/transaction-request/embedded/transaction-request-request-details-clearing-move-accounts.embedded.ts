import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Account } from 'src/schema/account/account.schema';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestDetailsClearingMoveAccounts {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  from?: Account;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Account' })
  to?: Account;
}

export const TransactionRequestRequestDetailsClearingMoveAccountsSchema = SchemaFactory.createForClass(
  TransactionRequestRequestDetailsClearingMoveAccounts,
);
