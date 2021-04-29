import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, SchemaTypes } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import {
  AccountDetails,
  AccountDetailsSchema,
} from './embedded/account-details.embedded';
import {
  AccountCryptoDetails,
  AccountCryptoDetailsSchema,
} from './embedded/account-crypto-details.embedded';
import {
  AccountFiatDetails,
  AccountFiatDetailsSchema,
} from './embedded/account-fiat-details.embedded';

export type AccountDocument = Account & Document;

@Schema({ versionKey: false })
export class Account {
  @ApiProperty({
    format: 'ObjectId',
  })
  _id?: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: User.name })
  owner?: User;

  @Prop({ type: AccountDetailsSchema })
  details?: AccountDetails;

  @Prop({ type: AccountFiatDetailsSchema })
  fiatDetails?: AccountFiatDetails;

  @Prop({ type: AccountCryptoDetailsSchema })
  cryptotDetails?: AccountCryptoDetails;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
