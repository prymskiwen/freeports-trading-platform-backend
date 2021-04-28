import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  TransactionRequestRequestDetailsClearingMoveAccounts,
  TransactionRequestRequestDetailsClearingMoveAccountsSchema,
} from './transaction-request-request-details-clearing-move-accounts.embedded';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestDetailsClearingMove {
  @Prop({ type: TransactionRequestRequestDetailsClearingMoveAccountsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  accounts: TransactionRequestRequestDetailsClearingMoveAccounts;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  amount: number;
}

export const TransactionRequestRequestDetailsClearingMoveSchema = SchemaFactory.createForClass(
  TransactionRequestRequestDetailsClearingMove,
);
