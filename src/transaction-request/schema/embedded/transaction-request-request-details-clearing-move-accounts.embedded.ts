import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';
import { Account } from 'src/account/schema/account.schema';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestDetailsClearingMoveAccounts {
  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name })
  from?: Account;

  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name })
  to?: Account;
}

export const TransactionRequestRequestDetailsClearingMoveAccountsSchema = SchemaFactory.createForClass(
  TransactionRequestRequestDetailsClearingMoveAccounts,
);
