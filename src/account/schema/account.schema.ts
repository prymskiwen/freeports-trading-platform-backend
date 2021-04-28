import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { Document, SchemaTypes } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import {
  AccountDetails,
  AccountDetailsSchema,
} from './embedded/account-details.embedded';
import {
  CryptoDetails,
  CryptoDetailsSchema,
} from './embedded/crypto-details.embedded';
import {
  FiatDetails,
  FiatDetailsSchema,
} from './embedded/fiat-details.embedded';

export type AccountDocument = Account & Document;

@Schema({ versionKey: false })
export class Account {
  @ApiProperty({ required: false })
  @IsOptional()
  _id: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name, required: false })
  @ApiProperty({ type: () => User, required: false })
  @IsOptional()
  owner: User;

  @Prop({ type: AccountDetailsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  accountDetails: AccountDetails;

  @Prop({ type: FiatDetailsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  fiatDetails: FiatDetails;

  @Prop({ type: CryptoDetailsSchema })
  @ApiProperty({ required: false })
  @IsOptional()
  cryptotDetails: CryptoDetails;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
