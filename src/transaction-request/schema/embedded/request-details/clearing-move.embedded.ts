import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Accounts, AccountsSchema } from './accounts.embedded';

@Schema({ versionKey: false, _id: false })
export class ClearingMove {
  @Prop({ type: AccountsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  accounts: Accounts;

  @Prop()
  @ApiProperty({ required: false })
  @IsOptional()
  amount: number;
}

export const ClearingMoveSchema = SchemaFactory.createForClass(ClearingMove);
