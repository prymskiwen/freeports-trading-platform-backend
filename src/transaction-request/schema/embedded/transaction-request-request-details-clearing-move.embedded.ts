import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  TransactionRequestRequestDetailsClearingMoveAccounts,
  TransactionRequestRequestDetailsClearingMoveAccountsSchema,
} from './transaction-request-request-details-clearing-move-accounts.embedded';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestDetailsClearingMove {
  @Prop({ type: TransactionRequestRequestDetailsClearingMoveAccountsSchema })
  accounts?: TransactionRequestRequestDetailsClearingMoveAccounts;

  @Prop()
  amount?: number;
}

export const TransactionRequestRequestDetailsClearingMoveSchema = SchemaFactory.createForClass(
  TransactionRequestRequestDetailsClearingMove,
);
