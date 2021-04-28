import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { SchemaTypes } from 'mongoose';
import { Account } from 'src/account/schema/account.schema';

@Schema({ versionKey: false, _id: false })
export class TransactionRequestRequestDetailsClearingMoveAccounts {
  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name, required: false })
  @ApiProperty({ type: () => Account, required: false })
  @IsOptional()
  from: Account;

  @Prop({ type: SchemaTypes.ObjectId, ref: Account.name, required: false })
  @ApiProperty({ type: () => Account, required: false })
  @IsOptional()
  to: Account;
}

export const TransactionRequestRequestDetailsClearingMoveAccountsSchema = SchemaFactory.createForClass(
  TransactionRequestRequestDetailsClearingMoveAccounts,
);
